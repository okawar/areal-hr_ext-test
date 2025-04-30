// const pool = require('../src/database/database');

// const argon2 = require('argon2');

// async function seedUsers() {
//   // await pool.query('DELETE FROM users');

//   const users = [
//     {
//       login: 'admin',
//       password: 'admin123',
//       role: 'admin',
//       last_name: 'Админ',
//       first_name: 'Системный',
//       middle_name: '',
//     },
//     {
//       login: 'hrmanager',
//       password: 'hr123',
//       role: 'hr_manager',
//       last_name: 'Менеджер',
//       first_name: 'HR',
//       middle_name: '',
//     },
//   ];

//   for (const user of users) {
//     const hash = await argon2.hash(user.password);
//     await pool.query(
//       `INSERT INTO users (
//         login, password_hash, role, last_name, first_name, middle_name,
//         created_at, updated_at
//       ) VALUES ($1, $2, $3, $4, $5, $6, now(), now())`,
//       [user.login, hash, user.role, user.last_name, user.first_name, user.middle_name]
//     );
//   }

//   console.log('✅ Users seeded');
// }

// module.exports = seedUsers;
