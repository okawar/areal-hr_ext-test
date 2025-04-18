const pool = require('../database/database');
const { orgSchema } = require('../validation/org.schema');
const { idSchema } = require('../validation/id.schema');
const { logChanges } = require('../utils/historyLogger');

const getOrgs = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM organizations WHERE deleted_at IS NULL');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getOrgById = async (req, res) => {
  const { error } = idSchema.validate(req.params);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const result = await pool.query(
      'SELECT * FROM organizations WHERE id = $1 AND deleted_at IS NULL',
      [req.params.id]
    );
    if (!result.rowCount) return res.status(404).json({ error: 'Организация не найдена' });

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createOrg = async (req, res) => {
  const { error, value } = orgSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const result = await client.query(
      'INSERT INTO organizations (name, comment, created_at) VALUES ($1, $2, NOW()) RETURNING *',
      [value.name, value.comment || '']
    );

    const createdOrg = result.rows[0];

    await logChanges('organization', createdOrg.id, null, createdOrg, 'create', req.user?.id || 1);

    await client.query('COMMIT');
    res.json(createdOrg);
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};

const updateOrg = async (req, res) => {
  const { error: idError } = idSchema.validate(req.params);
  if (idError) return res.status(400).json({ error: idError.details[0].message });

  const { id, is_deleted, created_at, updated_at, deleted_at, ...data } = req.body;

  const { error, value } = orgSchema.validate(data);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const currentResult = await client.query(
      'SELECT * FROM organizations WHERE id = $1 AND deleted_at IS NULL',
      [req.params.id]
    );
    if (!currentResult.rowCount) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Организация не найдена' });
    }

    const currentOrg = currentResult.rows[0];

    const result = await client.query(
      'UPDATE organizations SET name = $1, comment = $2, updated_at = NOW() WHERE id = $3 RETURNING *',
      [value.name, value.comment || '', req.params.id]
    );

    const updatedOrg = result.rows[0];

    await logChanges(
      'organization',
      req.params.id,
      currentOrg,
      updatedOrg,
      'update',
      req.user?.id || 1
    );

    await client.query('COMMIT');
    res.json(updatedOrg);
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};

const deleteOrg = async (req, res) => {
  const { error } = idSchema.validate(req.params);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const currentResult = await client.query(
      'SELECT * FROM organizations WHERE id = $1 AND deleted_at IS NULL',
      [req.params.id]
    );
    if (!currentResult.rowCount) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Организация не найдена' });
    }

    const currentOrg = currentResult.rows[0];

    await client.query('UPDATE organizations SET deleted_at = NOW() WHERE id = $1 RETURNING *', [
      req.params.id,
    ]);

    await logChanges('organization', req.params.id, currentOrg, null, 'delete', req.user?.id || 1);

    await client.query('COMMIT');
    res.json({ message: 'Организация удалена' });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};

module.exports = {
  getOrgs,
  getOrgById,
  createOrg,
  updateOrg,
  deleteOrg,
};
