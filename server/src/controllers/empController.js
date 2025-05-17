const pool = require('../database/database');
const { EmpSchema } = require('../validation/employee.schema');
const { idSchema } = require('../validation/id.schema');
const { logChanges } = require('../utils/historyLogger');

const getEmp = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT e.*, 
             d.name as department_name,
             p.name as position_name
      FROM employees e
      LEFT JOIN departments d ON e.department_id = d.id
      LEFT JOIN positions p ON e.position_id = p.id
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching employees:', err);
    res.status(500).json({
      error: 'Ошибка при получении сотрудников',
      details: err.message,
    });
  }
};

const getEmpById = async (req, res) => {
  const { error } = idSchema.validate(req.params);
  if (error) {
    return res.status(400).json({
      error: 'Неверный ID сотрудника',
      details: error.details[0].message,
    });
  }

  try {
    const result = await pool.query(
      `
      SELECT e.*, 
             d.name as department_name,
             p.name as position_name
      FROM employees e
      LEFT JOIN departments d ON e.department_id = d.id
      LEFT JOIN positions p ON e.position_id = p.id
      WHERE e.id = $1
      `,
      [req.params.id]
    );
    if (!result.rows.length) {
      return res.status(404).json({ error: 'Сотрудник не найден' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching employee by ID:', err);
    res.status(500).json({
      error: 'Ошибка при получении сотрудника',
      details: err.message,
    });
  }
};

const createEmp = async (req, res) => {
  const { error, value } = EmpSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: 'Неверные данные сотрудника',
      details: error.details[0].message,
    });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const result = await client.query(
      `INSERT INTO employees 
        (first_name, last_name, middle_name, birth_date, 
         passport_series, passport_number, passport_issue_date, passport_issued_by,
         region, locality, street, house, building, apartment, 
         department_id, position_id,
         created_at) 
       VALUES ($1, $2, $3, $4, 
               $5, $6, $7, $8, 
               $9, $10, $11, $12, $13, $14,
               $15, $16,
               NOW()) 
       RETURNING *`,
      [
        value.first_name,
        value.last_name,
        value.middle_name,
        value.birth_date,
        value.passport_series,
        value.passport_number,
        value.passport_issue_date,
        value.passport_issued_by,
        value.region,
        value.locality,
        value.street,
        value.house,
        value.building,
        value.apartment,
        value.department_id,
        value.position_id,
      ]
    );

    const createdEmp = result.rows[0];

    await logChanges(client, 'employee', createdEmp.id, null, createdEmp, 'create', req.user.id);

    await client.query('COMMIT');
    res.json(createdEmp);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error creating employee:', err);
    res.status(500).json({
      error: 'Ошибка при создании сотрудника',
      details: err.message,
    });
  } finally {
    client.release();
  }
};

const updateEmp = async (req, res) => {
  const { error: idError } = idSchema.validate(req.params);
  if (idError) {
    return res.status(400).json({
      error: 'Неверный ID сотрудника',
      details: idError.details[0].message,
    });
  }

  const { id, created_at, updated_at, deleted_at, ...data } = req.body;
  const { error, value } = EmpSchema.validate(data);
  if (error) {
    return res.status(400).json({
      error: 'Неверные данные сотрудника',
      details: error.details[0].message,
    });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const currentResult = await client.query(
      'SELECT * FROM employees WHERE id = $1 AND deleted_at IS NULL',
      [req.params.id]
    );

    if (!currentResult.rowCount) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Сотрудник не найден' });
    }
    const currentEmp = currentResult.rows[0];

    const result = await client.query(
      `UPDATE employees 
       SET first_name = $1, last_name = $2, middle_name = $3, birth_date = $4, 
           passport_series = $5, passport_number = $6, passport_issue_date = $7, passport_issued_by = $8,
           region = $9, locality = $10, street = $11, house = $12, building = $13, apartment = $14, 
           department_id = $15, position_id = $16,
           updated_at = NOW() 
       WHERE id = $17 
       RETURNING *`,
      [
        value.first_name,
        value.last_name,
        value.middle_name,
        value.birth_date,
        value.passport_series,
        value.passport_number,
        value.passport_issue_date,
        value.passport_issued_by,
        value.region,
        value.locality,
        value.street,
        value.house,
        value.building,
        value.apartment,
        value.department_id,
        value.position_id,
        req.params.id,
      ]
    );

    const updatedEmp = result.rows[0];

    await logChanges(
      client,
      'employee',
      req.params.id,
      currentEmp,
      updatedEmp,
      'update',
      req.user.id
    );

    await client.query('COMMIT');
    res.json(updatedEmp);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error updating employee:', err);
    res.status(500).json({
      error: 'Ошибка при обновлении сотрудника',
      details: err.message,
    });
  } finally {
    client.release();
  }
};

const deleteEmp = async (req, res) => {
  const { error } = idSchema.validate(req.params);
  if (error) {
    return res.status(400).json({
      error: 'Неверный ID сотрудника',
      details: error.details[0].message,
    });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const currentResult = await client.query(
      'SELECT * FROM employees WHERE id = $1 AND deleted_at IS NULL',
      [req.params.id]
    );

    if (!currentResult.rowCount) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Сотрудник не найден' });
    }
    const currentEmp = currentResult.rows[0];

    await client.query('UPDATE employees SET deleted_at = NOW() WHERE id = $1 RETURNING *', [
      req.params.id,
    ]);

    await logChanges(client, 'employee', req.params.id, currentEmp, null, 'delete', req.user.id);

    await client.query('COMMIT');
    res.json({ message: 'Сотрудник удален' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error deleting employee:', err);
    res.status(500).json({
      error: 'Ошибка при удалении сотрудника',
      details: err.message,
    });
  } finally {
    client.release();
  }
};

module.exports = {
  getEmp,
  getEmpById,
  createEmp,
  updateEmp,
  deleteEmp,
};
