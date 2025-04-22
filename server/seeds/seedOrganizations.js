const pool = require('../src/database/database');

async function seedOrganizations() {
  await pool.query('DELETE FROM organizations');

  const orgs = [
    ['ООО "Ромашка"', 'Крупная IT-компания'],
    ['ЗАО "Гостиница Уют"', 'Гостиничный комплекс'],
  ];

  for (const [name, comment] of orgs) {
    await pool.query(
      `INSERT INTO organizations (name, comment, created_at, updated_at) VALUES ($1, $2, now(), now())`,
      [name, comment]
    );
  }

  console.log('✅ Organizations seeded');
}

module.exports = seedOrganizations;
