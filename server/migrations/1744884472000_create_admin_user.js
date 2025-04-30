const argon2 = require('argon2');
require('dotenv').config({ path: '../../../.env' });

exports.up = async (pgm) => {
  const adminLogin = process.env.ADMIN_LOGIN || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'adminpassword';
  const hashedPassword = await argon2.hash(adminPassword);

  const res = await pgm.db.query('SELECT * FROM users WHERE login = $1', [adminLogin]);

  if (res.rows.length === 0) {
    await pgm.db.query(
      'INSERT INTO users (login, password_hash, role, created_at, first_name, last_name) VALUES ($1, $2, $3, NOW(), $4, $5)',
      [adminLogin, hashedPassword, 'admin', 'Admin', 'Adminov']
    );
    console.log('Администратор создан!');
  } else {
    console.log('Администратор уже существует');
  }
};

exports.down = async (pgm) => {
  const adminLogin = process.env.ADMIN_LOGIN || 'admin';
  await pgm.db.query('DELETE FROM users WHERE login = $1', [adminLogin]);
};
