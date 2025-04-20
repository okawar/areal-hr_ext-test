const pool = require('../database/database');
const { positionSchema } = require('../validation/pos.schema');
const { idSchema } = require('../validation/id.schema');
const { logChanges } = require('../utils/historyLogger');

const getPos = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM positions WHERE deleted_at IS NULL');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching positions:', err);
    res.status(500).json({ 
      error: 'Ошибка при получении должностей', 
      details: err.message 
    });
  }
};

const getPosById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM positions WHERE id = $1 AND deleted_at IS NULL',
      [id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Должность не найдена' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching position by ID:', err);
    res.status(500).json({ 
      error: 'Ошибка при получении должности', 
      details: err.message 
    });
  }
};

const createPos = async (req, res) => {
  const { error, value } = positionSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: "Неверные данные должности", details: error.details[0].message });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const result = await client.query(
      'INSERT INTO positions (name, created_at) VALUES ($1, NOW()) RETURNING *',
      [value.name]
    );

    const createdPos = result.rows[0];

    await logChanges('position', createdPos.id, null, createdPos, 'create', req.user?.id || 1);

    await client.query('COMMIT');
    res.json(createdPos);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error creating position:', err);
    if (err.code === '23505') {
      return res.status(400).json({ error: 'Должность с таким названием уже существует' });
    }
    res.status(500).json({ 
      error: 'Ошибка при создании должности', 
      details: err.message 
    });
  } finally {
    client.release();
  }
};

const updatePos = async (req, res) => {
  const { error: idError } = idSchema.validate(req.params);
  if (idError) {
    return res.status(400).json({ error: 'Неверный ID должности', details: idError.details[0].message });
  }

  const { id, created_at, updated_at, deleted_at, ...data } = req.body;

  const { error, value } = positionSchema.validate(data);
  if (error) {
    return res.status(400).json({ 
      error: 'Неверные данные должности', 
      details: error.details[0].message 
    });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const currentResult = await client.query(
      'SELECT * FROM positions WHERE id = $1 AND deleted_at IS NULL',
      [req.params.id]
    );

    if (!currentResult.rowCount) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Должность не найдена' });
    }
    const currentPos = currentResult.rows[0];

    const updatedResult = await client.query(
      'UPDATE positions SET name = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [value.name, req.params.id]
    );

    const updatedPos = updatedResult.rows[0];

    await logChanges(
      'position',
      req.params.id,
      currentPos,
      updatedPos,
      'update',
      req.user?.id || 1
    );

    await client.query('COMMIT');
    res.json(updatedPos);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error updating position:', err);
    res.status(500).json({ 
      error: 'Ошибка при обновлении должности', 
      details: err.message 
    });
  } finally {
    client.release();
  }
};

const deletePos = async (req, res) => {
  const error = idSchema.validate(req.params);
  if (error) {
    return res.status(400).json({ error: 
      'Неверный ID должности', 
      details: error.details[0].message 
    });
  }
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const result = await client.query(
      'SELECT * FROM positions WHERE id = $1 AND deleted_at IS NULL',
      [id]
    );

    if (!result.rowCount) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Должность не найдена', details: error.details[0].message });
    }

    const currentPos = result.rows[0];

    await client.query('UPDATE positions SET deleted_at = NOW() WHERE id = $1 RETURNING *', [id]);

    await logChanges('position', id, currentPos, null, 'delete', req.user?.id || 1);

    await client.query('COMMIT');
    res.json({ message: 'Должность удалена' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error deleting position:', err);
    res.status(500).json({ 
      error: 'Ошибка при удалении должности', 
      details: err.message 
    });
  } finally {
    client.release();
  }
};

module.exports = { 
  getPos, 
  getPosById, 
  createPos, 
  updatePos, 
  deletePos 
};
