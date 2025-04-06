// routes/users.js
const express = require('express');
const argon2 = require('argon2');
const pool = require('../database/database');
const { ensureAuthenticated, ensureAdmin } = require('../middleware/auth');

const router = express.Router();

router.use(ensureAuthenticated, ensureAdmin);

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, last_name, first_name, middle_name, login, role, is_deleted, created_at, updated_at, deleted_at 
       FROM users WHERE is_deleted = false`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Получение конкретного пользователя по id
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, last_name, first_name, middle_name, login, role, is_deleted, created_at, updated_at, deleted_at 
       FROM users WHERE id = $1 AND is_deleted = false`,
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Пользователь не найден' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Создание нового пользователя
router.post('/', async (req, res) => {
  const { last_name, first_name, middle_name, login, password, role } = req.body;
  try {
    const hash = await argon2.hash(password, { type: argon2.argon2id });
    const result = await pool.query(
      `INSERT INTO users 
         (last_name, first_name, middle_name, login, password_hash, role, is_deleted, created_at, updated_at)
       VALUES 
         ($1, $2, $3, $4, $5, $6, false, NOW(), NOW())
       RETURNING id, last_name, first_name, middle_name, login, role, is_deleted, created_at, updated_at, deleted_at`,
      [last_name, first_name, middle_name || null, login, hash, role]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { last_name, first_name, middle_name, login, password, role } = req.body;
  try {
    let query, params;
    if (password) {
      const hash = await argon2.hash(password, { type: argon2.argon2id });
      query = `
        UPDATE users 
        SET last_name = $1, first_name = $2, middle_name = $3, login = $4, password_hash = $5, role = $6, updated_at = NOW()
        WHERE id = $7 AND is_deleted = false
        RETURNING id, last_name, first_name, middle_name, login, role, is_deleted, created_at, updated_at, deleted_at`;
      params = [last_name, first_name, middle_name || null, login, hash, role, req.params.id];
    } else {
      query = `
        UPDATE users 
        SET last_name = $1, first_name = $2, middle_name = $3, login = $4, role = $5, updated_at = NOW()
        WHERE id = $6 AND is_deleted = false
        RETURNING id, last_name, first_name, middle_name, login, role, is_deleted, created_at, updated_at, deleted_at`;
      params = [last_name, first_name, middle_name || null, login, role, req.params.id];
    }
    const result = await pool.query(query, params);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Пользователь не найден' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE users 
       SET is_deleted = true, deleted_at = NOW(), updated_at = NOW() 
       WHERE id = $1 RETURNING id, last_name, first_name, middle_name, login, role, is_deleted, created_at, updated_at, deleted_at`,
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Пользователь не найден' });
    res.json({ message: 'Пользователь удалён (soft delete)', user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
