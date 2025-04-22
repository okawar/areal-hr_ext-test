const pool = require('../src/database/database');

async function seedPositions() {
  await pool.query('DELETE FROM positions');

  const positions = ['Менеджер', 'HR-специалист', 'Разработчик', 'Дизайнер'];

  for (const name of positions) {
    await pool.query(
      `INSERT INTO positions (name, created_at, updated_at) VALUES ($1, now(), now())`,
      [name]
    );
  }

  console.log('✅ Positions seeded');
}

module.exports = seedPositions;
