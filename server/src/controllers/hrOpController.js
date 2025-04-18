const pool = require('../database/database');
const { operationSchema } = require('../validation/operation.schema');
const { idSchema } = require('../validation/id.schema');
const { logChanges } = require('../utils/historyLogger');

const getOperations = async (req, res) => {
  try {
    const query = `
      SELECT o.*, 
        e.first_name || ' ' || e.last_name AS employee_name,
        d.name AS department_name,
        p.name AS position_name
      FROM hr_operations o
      LEFT JOIN employees e ON o.employee_id = e.id
      LEFT JOIN departments d ON o.department_id = d.id
      LEFT JOIN positions p ON o.position_id = p.id
      ORDER BY o.operation_date DESC
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching operations:', err);
    res.status(500).json({
      error: 'Ошибка при получении операций',
      details: err.message,
    });
  }
};

const getOperationById = async (req, res) => {
  const { error } = idSchema.validate(req.params);
  if (error) {
    return res.status(400).json({
      error: 'Неверный ID операции',
      details: error.details[0].message,
    });
  }

  try {
    const query = `
      SELECT o.*, 
        e.first_name || ' ' || e.last_name AS employee_name,
        d.name AS department_name,
        p.name AS position_name
      FROM hr_operations o
      LEFT JOIN employees e ON o.employee_id = e.id
      LEFT JOIN departments d ON o.department_id = d.id
      LEFT JOIN positions p ON o.position_id = p.id
      WHERE o.id = $1
    `;
    const result = await pool.query(query, [req.params.id]);

    if (!result.rows.length) {
      return res.status(404).json({
        error: 'Операция не найдена',
      });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching operation by ID:', err);
    res.status(500).json({
      error: 'Ошибка при получении операции',
      details: err.message,
    });
  }
};

const createOperation = async (req, res) => {
  const { error, value } = operationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: 'Неверные данные операции',
      details: error.details[0].message,
    });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const query = `
      INSERT INTO hr_operations (
        employee_id, 
        department_id, 
        position_id, 
        action_type, 
        salary, 
        operation_date, 
        created_at
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, NOW()) 
      RETURNING *
    `;

    const result = await client.query(query, [
      value.employee_id,
      value.department_id || null,
      value.position_id || null,
      value.action_type,
      value.salary || null,
      value.operation_date,
    ]);

    const createdOperation = result.rows[0];

    await logChanges(
      'hr_operations',
      createdOperation.id,
      null,
      createdOperation,
      'create',
      req.user?.id || 1
    );

    await client.query('COMMIT');
    res.status(201).json(createdOperation);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error creating operation:', err);
    res.status(500).json({
      error: 'Ошибка при создании операции',
      details: err.message,
    });
  } finally {
    client.release();
  }
};

const updateOperation = async (req, res) => {
  const { error: idError } = idSchema.validate(req.params);
  if (idError) {
    return res.status(400).json({
      error: 'Неверный ID операции',
      details: idError.details[0].message,
    });
  }

  const { error, value } = operationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: 'Неверные данные операции',
      details: error.details[0].message,
    });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const currentResult = await client.query('SELECT * FROM hr_operations WHERE id = $1', [
      req.params.id,
    ]);

    if (!currentResult.rowCount) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        error: 'Операция не найдена',
      });
    }

    const currentOperation = currentResult.rows[0];

    const updateQuery = `
      UPDATE hr_operations SET 
        employee_id = $1,
        department_id = $2,
        position_id = $3,
        action_type = $4,
        salary = $5,
        operation_date = $6,
        updated_at = NOW()
      WHERE id = $7
      RETURNING *
    `;

    const result = await client.query(updateQuery, [
      value.employee_id,
      value.department_id || null,
      value.position_id || null,
      value.action_type,
      value.salary || null,
      value.operation_date,
      req.params.id,
    ]);

    const updatedOperation = result.rows[0];

    await logChanges(
      'hr_operations',
      req.params.id,
      currentOperation,
      updatedOperation,
      'update',
      req.user?.id || 1
    );

    await client.query('COMMIT');
    res.json(updatedOperation);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error updating operation:', err);
    res.status(500).json({
      error: 'Ошибка при обновлении операции',
      details: err.message,
    });
  } finally {
    client.release();
  }
};

const deleteOperation = async (req, res) => {
  const { error } = idSchema.validate(req.params);
  if (error) {
    return res.status(400).json({
      error: 'Неверный ID операции',
      details: error.details[0].message,
    });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const currentResult = await client.query('SELECT * FROM hr_operations WHERE id = $1', [
      req.params.id,
    ]);

    if (!currentResult.rowCount) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        error: 'Операция не найдена',
      });
    }

    const currentOperation = currentResult.rows[0];

    const query = `
      DELETE FROM hr_operations 
      WHERE id = $1
      RETURNING *
    `;

    const result = await client.query(query, [req.params.id]);

    await logChanges(
      'hr_operations',
      req.params.id,
      currentOperation,
      null,
      'delete',
      req.user?.id || 1
    );

    await client.query('COMMIT');
    res.json({
      message: 'Операция успешно удалена',
      deletedOperation: result.rows[0],
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error deleting operation:', err);
    res.status(500).json({
      error: 'Ошибка при удалении операции',
      details: err.message,
    });
  } finally {
    client.release();
  }
};

module.exports = {
  getOperations,
  getOperationById,
  createOperation,
  updateOperation,
  deleteOperation,
};
