const pool = require('../database/database');
const { idSchema } = require('../validation/id.schema');
const { userSchema } = require('../validation/user.schema');
const argon2 = require('argon2');
// const { logChanges } = require('../utils/historyLogger');

const getUsers = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, last_name, first_name, middle_name, login, role, created_at, updated_at FROM users WHERE deleted_at IS NULL'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getUserById = async (req, res) => {
  const { error } = idSchema.validate(req.params);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const result = await pool.query(
      'SELECT id, last_name, first_name, middle_name, login, role, created_at, updated_at FROM users WHERE id = $1 AND deleted_at IS NULL',
      [req.params.id]
    );

    if (!result.rows.length) return res.status(404).json({ error: 'Пользователь не найден' });

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createUser = async (req, res) => {
  const { error, value } = userSchema.validate(req.body, { context: { isUpdate: false } });
  if (error) return res.status(400).json({ error: error.details[0].message });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const existingUser = await client.query(
      'SELECT id FROM users WHERE login = $1 AND deleted_at IS NULL',
      [value.login]
    );
    if (existingUser.rows.length) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Пользователь с таким логином уже существует' });
    }

    const password_hash = await argon2.hash(value.password);

    const result = await client.query(
      `INSERT INTO users 
       (last_name, first_name, middle_name, login, password_hash, role, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING 
       id, last_name, first_name, middle_name, login, role, created_at, updated_at`,
      [value.last_name, value.first_name, value.middle_name, value.login, password_hash, value.role]
    );

    const createdUser = result.rows[0];

    // const userForLog = { ...createdUser };
    // await logChanges('user', createdUser.id, null, userForLog, 'create', 1);

    await client.query('COMMIT');
    res.json(createdUser);
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};

const updateUser = async (req, res) => {
  const { error: idError } = idSchema.validate(req.params);
  if (idError) return res.status(400).json({ error: idError.details[0].message });

  const { id, created_at, updated_at, deleted_at, password_hash, ...data } = req.body;
  const { error, value } = userSchema.validate(data, { context: { isUpdate: true } });
  if (error) return res.status(400).json({ error: error.details[0].message });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const currentResult = await client.query(
      'SELECT * FROM users WHERE id = $1 AND deleted_at IS NULL',
      [req.params.id]
    );

    if (!currentResult.rowCount) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    const currentUser = currentResult.rows[0];

    if (value.login !== currentUser.login) {
      const existingUser = await client.query(
        'SELECT id FROM users WHERE login = $1 AND id != $2 AND deleted_at IS NULL',
        [value.login, req.params.id]
      );

      if (existingUser.rows.length) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: 'Пользователь с таким логином уже существует' });
      }
    }

    let updateQuery;
    let params;

    if (value.password && value.password.trim() !== '') {
      const password_hash = await argon2.hash(value.password);
      updateQuery = `
        UPDATE users SET 
        last_name = $1, 
        first_name = $2, 
        middle_name = $3, 
        login = $4, 
        password_hash = $5, 
        role = $6, 
        updated_at = NOW() 
        WHERE id = $7 
        RETURNING id, last_name, first_name, middle_name, login, role, created_at, updated_at`;
      params = [
        value.last_name,
        value.first_name,
        value.middle_name,
        value.login,
        password_hash,
        value.role,
        req.params.id,
      ];
    } else {
      updateQuery = `
        UPDATE users SET 
        last_name = $1, 
        first_name = $2, 
        middle_name = $3, 
        login = $4, 
        role = $5, 
        updated_at = NOW() 
        WHERE id = $6 
        RETURNING id, last_name, first_name, middle_name, login, role, created_at, updated_at`;
      params = [
        value.last_name,
        value.first_name,
        value.middle_name,
        value.login,
        value.role,
        req.params.id,
      ];
    }

    const updateResult = await client.query(updateQuery, params);
    const updatedUser = updateResult.rows[0];

    const userForLog = { ...updatedUser };
    // await logChanges('user', req.params.id, { ...currentUser }, userForLog, 'update', 1);

    await client.query('COMMIT');
    res.json(updatedUser);
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};

const deleteUser = async (req, res) => {
  const { error } = idSchema.validate(req.params);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const currentResult = await client.query(
      'SELECT * FROM users WHERE id = $1 AND deleted_at IS NULL',
      [req.params.id]
    );

    if (!currentResult.rowCount) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    const currentUser = currentResult.rows[0];

    await client.query('UPDATE users SET deleted_at = NOW() WHERE id = $1', [req.params.id]);

    const userForLog = { ...currentUser };
    delete userForLog.password_hash;
    // await logChanges('user', req.params.id, userForLog, null, 'delete', 1);

    await client.query('COMMIT');
    res.json({ message: 'Пользователь удален' });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};

module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser };
