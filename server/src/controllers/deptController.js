const pool = require('../database/database');
const { idSchema } = require('../validation/id.schema');
const { deptSchema } = require('../validation/dept.schema');
const { logChanges } = require('../utils/historyLogger');

const getDepts = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM departments WHERE deleted_at IS NULL');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getDeptById = async (req, res) => {
  const { error } = idSchema.validate(req.params);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const result = await pool.query(
      'SELECT * FROM departments WHERE id = $1 AND deleted_at IS NULL',
      [req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Отдел не найден' });

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createDept = async (req, res) => {
  const { error, value } = deptSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const result = await client.query(
      'INSERT INTO departments (name, organization_id, parent_id, comment, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
      [value.name, value.organization_id, value.parent_id, value.comment]
    );

    const createdDept = result.rows[0];

    await logChanges('department', createdDept.id, null, createdDept, 'create', req.user?.id || 1);

    await client.query('COMMIT');
    res.json(createdDept);
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};

const updateDept = async (req, res) => {
  const { error: idError } = idSchema.validate(req.params);
  if (idError) return res.status(400).json({ error: idError.details[0].message });

  const { id, is_deleted, created_at, updated_at, deleted_at, ...data } = req.body;
  const { error, value } = deptSchema.validate(data);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const currentResult = await client.query(
      'SELECT * FROM departments WHERE id = $1 AND deleted_at IS NULL',
      [req.params.id]
    );
    if (!currentResult.rowCount) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Отдел не найден' });
    }

    const currentDept = currentResult.rows[0];

    const updateResult = await client.query(
      'UPDATE departments SET name = $1, organization_id = $2, parent_id = $3, comment = $4, updated_at = NOW() WHERE id = $5 RETURNING *',
      [value.name, value.organization_id, value.parent_id, value.comment, req.params.id]
    );

    const updatedDept = updateResult.rows[0];

    await logChanges(
      'department',
      req.params.id,
      currentDept,
      updatedDept,
      'update',
      req.user?.id || 1
    );

    await client.query('COMMIT');
    res.json(updatedDept);
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};

const deleteDept = async (req, res) => {
  const { error } = idSchema.validate(req.params);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const currentResult = await client.query(
      'SELECT * FROM departments WHERE id = $1 AND deleted_at IS NULL',
      [req.params.id]
    );
    if (!currentResult.rowCount) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Отдел не найден' });
    }

    const currentDept = currentResult.rows[0];

    await client.query('UPDATE departments SET deleted_at = NOW() WHERE id = $1 RETURNING *', [
      req.params.id,
    ]);

    await logChanges('department', req.params.id, currentDept, null, 'delete', req.user?.id || 1);

    await client.query('COMMIT');
    res.json({ message: 'Отдел удален' });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};

module.exports = { getDepts, getDeptById, createDept, updateDept, deleteDept };
