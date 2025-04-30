const Joi = require('joi');
const pool = require('../database/database');

const { ChangeHistorySchema } = require('../validation/changeHistory.schema');
const { idSchema } = require('../validation/id.schema');

// Словарь для перевода типов объектов на русский язык
const objectTypeTranslations = {
  'organization': 'Организация',
  'department': 'Отдел',
  'position': 'Должность',
  'employee': 'Сотрудник',
  'hr_operations': 'HR-операция'
};

// Функция для форматирования данных истории изменений
const formatChangeHistoryData = (data) => {
  // Если это массив, обрабатываем каждый элемент
  if (Array.isArray(data)) {
    return data.map(item => formatChangeHistoryData(item));
  }
  
  // Перевод типа объекта на русский
  if (data.object_type) {
    data.object_type_ru = objectTypeTranslations[data.object_type] || data.object_type;
  }
  
  // Форматирование информации о пользователе
  if (data.change_by_info) {
    data.change_by_display = `${data.change_by_info.last_name || ''} ${data.change_by_info.first_name || ''} ${data.change_by_info.middle_name || ''}`.trim();
    if (!data.change_by_display) {
      data.change_by_display = data.change_by_info.login || `ID: ${data.change_by}`;
    }
  } else {
    data.change_by_display = `ID: ${data.change_by}`;
  }
  
  return data;
};

const getChangeHistory = async (req, res) => {
  try {
    const query = `
      SELECT ch.*, 
             json_build_object(
               'id', u.id,
               'login', u.login,
               'first_name', u.first_name,
               'last_name', u.last_name,
               'middle_name', u.middle_name
             ) as change_by_info
      FROM change_history ch
      LEFT JOIN users u ON ch.change_by = u.id
      ORDER BY ch.change_time DESC
    `;
    const result = await pool.query(query);
    res.json(formatChangeHistoryData(result.rows));
  } catch (err) {
    console.error('Error fetching change history:', err);
    res.status(500).json({
      error: 'Ошибка при получении истории изменений',
      details: err.message,
    });
  }
};

const getChangeHistoryById = async (req, res) => {
  const { error } = idSchema.validate(req.params);
  if (error) {
    return res.status(400).json({
      error: 'Неверный ID записи',
      details: error.details[0].message,
    });
  }

  try {
    const query = `
      SELECT ch.*, 
             json_build_object(
               'id', u.id,
               'login', u.login,
               'first_name', u.first_name,
               'last_name', u.last_name,
               'middle_name', u.middle_name
             ) as change_by_info
      FROM change_history ch
      LEFT JOIN users u ON ch.change_by = u.id
      WHERE ch.id = $1
    `;
    const result = await pool.query(query, [req.params.id]);

    if (!result.rows.length) {
      return res.status(404).json({
        error: 'Запись истории изменений не найдена',
      });
    }

    res.json(formatChangeHistoryData(result.rows[0]));
  } catch (err) {
    console.error('Error fetching change history by ID:', err);
    res.status(500).json({
      error: 'Ошибка при получении записи истории изменений',
      details: err.message,
    });
  }
};

const getChangeHistoryByObject = async (req, res) => {
  const objectSchema = Joi.object({
    object_type: Joi.string()
      .valid('organization', 'department', 'position', 'employee', 'hr_operations')
      .required(),
    object_id: Joi.number().integer().positive().required(),
  });

  const { error } = objectSchema.validate(req.params);
  if (error) {
    return res.status(400).json({
      error: 'Неверные параметры объекта',
      details: error.details[0].message,
    });
  }

  try {
    const query = `
      SELECT ch.*, 
             json_build_object(
               'id', u.id,
               'login', u.login,
               'first_name', u.first_name,
               'last_name', u.last_name,
               'middle_name', u.middle_name
             ) as change_by_info
      FROM change_history ch
      LEFT JOIN users u ON ch.change_by = u.id
      WHERE ch.object_type = $1 AND ch.object_id = $2
      ORDER BY ch.change_time DESC
    `;
    const result = await pool.query(query, [req.params.object_type, req.params.object_id]);

    res.json(formatChangeHistoryData(result.rows));
  } catch (err) {
    console.error('Error fetching change history by object:', err);
    res.status(500).json({
      error: 'Ошибка при получении истории изменений объекта',
      details: err.message,
    });
  }
};

const createChangeHistory = async (req, res) => {
  const { error, value } = ChangeHistorySchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: 'Неверные данные записи',
      details: error.details[0].message,
    });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const changeBy = req.user.id;

    const query = `
      INSERT INTO change_history 
        (change_time, change_by, object_type, object_id, changed_fields, created_at) 
      VALUES (NOW(), $1, $2, $3, $4, NOW()) 
      RETURNING *
    `;
    const result = await client.query(query, [
      changeBy,
      value.object_type,
      value.object_id,
      value.changed_fields,
    ]);

    // Получаем данные пользователя для форматирования ответа
    const userQuery = `
      SELECT id, login, first_name, last_name, middle_name
      FROM users
      WHERE id = $1
    `;
    const userResult = await client.query(userQuery, [changeBy]);
    
    const recordWithUser = { 
      ...result.rows[0],
      change_by_info: userResult.rows[0] || null
    };

    await client.query('COMMIT');
    res.status(201).json(formatChangeHistoryData(recordWithUser));
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error creating change history:', err);
    res.status(500).json({
      error: 'Ошибка при создании записи истории изменений',
      details: err.message,
    });
  } finally {
    client.release();
  }
};

const updateChangeHistory = async (req, res) => {
  const { error: idError } = idSchema.validate(req.params);
  if (idError) {
    return res.status(400).json({
      error: 'Неверный ID записи',
      details: idError.details[0].message,
    });
  }

  const { id, created_at, ...data } = req.body;
  const { error, value } = ChangeHistorySchema.validate(data);
  if (error) {
    return res.status(400).json({
      error: 'Неверные данные записи',
      details: error.details[0].message,
    });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const changeBy = req.user.id;

    const checkResult = await client.query('SELECT 1 FROM change_history WHERE id = $1', [
      req.params.id,
    ]);

    if (!checkResult.rowCount) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        error: 'Запись истории изменений не найдена',
      });
    }

    const query = `
      UPDATE change_history 
      SET change_time = $1, 
          change_by = $2, 
          object_type = $3, 
          object_id = $4, 
          changed_fields = $5,
          updated_at = NOW()
      WHERE id = $6 
      RETURNING *
    `;
    const result = await client.query(query, [
      value.change_time || new Date(),
      changeBy,
      value.object_type,
      value.object_id,
      value.changed_fields,
      req.params.id,
    ]);

    // Получаем данные пользователя для форматирования ответа
    const userQuery = `
      SELECT id, login, first_name, last_name, middle_name
      FROM users
      WHERE id = $1
    `;
    const userResult = await client.query(userQuery, [changeBy]);
    
    const recordWithUser = { 
      ...result.rows[0],
      change_by_info: userResult.rows[0] || null
    };

    await client.query('COMMIT');
    res.json(formatChangeHistoryData(recordWithUser));
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error updating change history:', err);
    res.status(500).json({
      error: 'Ошибка при обновлении записи истории изменений',
      details: err.message,
    });
  } finally {
    client.release();
  }
};

const deleteChangeHistory = async (req, res) => {
  const { error } = idSchema.validate(req.params);
  if (error) {
    return res.status(400).json({
      error: 'Неверный ID записи',
      details: error.details[0].message,
    });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const result = await client.query('DELETE FROM change_history WHERE id = $1 RETURNING *', [
      req.params.id,
    ]);

    if (!result.rowCount) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        error: 'Запись истории изменений не найдена',
      });
    }

    await client.query('COMMIT');
    res.json({
      message: 'Запись истории изменений удалена',
      deletedRecord: result.rows[0],
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error deleting change history:', err);
    res.status(500).json({
      error: 'Ошибка при удалении записи истории изменений',
      details: err.message,
    });
  } finally {
    client.release();
  }
};

module.exports = {
  getChangeHistory,
  getChangeHistoryById,
  getChangeHistoryByObject,
  createChangeHistory,
  updateChangeHistory,
  deleteChangeHistory,
};