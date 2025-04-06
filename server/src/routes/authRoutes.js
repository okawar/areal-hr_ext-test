const express = require('express');
const passport = require('passport');
const argon2 = require('argon2');
const pool = require('../database/database');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { last_name, first_name, middle_name, login, password, role } = req.body;
  try {
    const hash = await argon2.hash(password, { type: argon2.argon2id });
    await pool.query(
      `INSERT INTO users (last_name, first_name, middle_name, login, password_hash, role, is_deleted, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, false, NOW(), NOW())`,
      [last_name, first_name, middle_name || null, login, hash, role]
    );
    res.status(201).json({ message: 'Пользователь успешно зарегистрирован' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', passport.authenticate('local'), (req, res) => {
  res.json({ message: 'Успешный вход', user: req.user });
});

router.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Вы успешно вышли из системы' });
  });
});

router.get('/me', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: 'Пользователь не авторизован' });
  }
});

module.exports = router;
