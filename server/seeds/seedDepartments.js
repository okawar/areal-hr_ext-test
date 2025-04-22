const pool = require('../src/database/database');

async function seedDepartments() {
  await pool.query('DELETE FROM departments');

  const orgId = 1;

  const deps = [
    ['Отдел разработки', null],
    ['Отдел кадров', null],
    ['Подотдел тестирования', 1],
  ];

  for (const [name, parentId] of deps) {
    await pool.query(
      `INSERT INTO departments (organization_id, name, parent_id, created_at, updated_at)
       VALUES ($1, $2, $3, now(), now())`,
      [orgId, name, parentId]
    );
  }

  console.log('✅ Departments seeded');
}

module.exports = seedDepartments;
