const pool = require('../src/database/database');

async function seedEmployees() {
  await pool.query('DELETE FROM employees');

  const employees = [
    {
      last_name: 'Иванов',
      first_name: 'Иван',
      middle_name: 'Иванович',
      birth_date: '1990-01-01',
      passport_series: '1234',
      passport_number: '567890',
      passport_issue_date: '2010-06-01',
      passport_issued_by: 'УФМС России',
      region: 'Москва',
      locality: 'ЦАО',
      street: 'Тверская',
      house: '10',
      building: '1',
      apartment: '101',
      department_id: 1,
      position_id: 3,
    },
  ];

  for (const emp of employees) {
    await pool.query(
      `INSERT INTO employees (
        last_name, first_name, middle_name, birth_date,
        passport_series, passport_number, passport_issue_date, passport_issued_by,
        region, locality, street, house, building, apartment,
        department_id, position_id,
        created_at, updated_at
      ) VALUES (
        $1,$2,$3,$4, $5,$6,$7,$8, $9,$10,$11,$12,$13,$14, $15,$16, now(), now()
      )`,
      [
        emp.last_name,
        emp.first_name,
        emp.middle_name,
        emp.birth_date,
        emp.passport_series,
        emp.passport_number,
        emp.passport_issue_date,
        emp.passport_issued_by,
        emp.region,
        emp.locality,
        emp.street,
        emp.house,
        emp.building,
        emp.apartment,
        emp.department_id,
        emp.position_id,
      ]
    );
  }

  console.log('✅ Employees seeded');
}

module.exports = seedEmployees;
