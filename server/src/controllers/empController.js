const pool = require("../database/database");

const { EmpSchema } = require("../validation/employee.schema");
const { idSchema } = require("../validation/id.schema");


const getEmp = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT e.*, 
                   d.name as department_name,
                   p.name as position_name
            FROM employees e
            LEFT JOIN departments d ON e.department_id = d.id
            LEFT JOIN positions p ON e.position_id = p.id
            WHERE e.is_deleted = FALSE
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getEmpById = async (req, res) => {
    const { error } = idSchema.validate(req.params);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
        const result = await pool.query(`
            SELECT e.*, 
                   d.name as department_name,
                   p.name as position_name
            FROM employees e
            LEFT JOIN departments d ON e.department_id = d.id
            LEFT JOIN positions p ON e.position_id = p.id
            WHERE e.id = $1 AND e.is_deleted = FALSE
        `, [req.params.id]);
        if (!result.rows.length) return res.status(404).json({ error: "Сотрудник не найден" });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const createEmp = async (req, res) => {
    const { error, value } = EmpSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
        const result = await pool.query(
            `INSERT INTO employees 
                (first_name, last_name, middle_name, birth_date, 
                 passport_series, passport_number, passport_issue_date, passport_issued_by,
                 region, locality, street, house, building, apartment, 
                 department_id, position_id,
                 is_deleted, created_at, updated_at) 
             VALUES ($1, $2, $3, $4, 
                     $5, $6, $7, $8, 
                     $9, $10, $11, $12, $13, $14,
                     $15, $16,
                     FALSE, NOW(), NOW()) 
             RETURNING *`,
            [
                value.first_name, value.last_name, value.middle_name, value.birth_date, 
                value.passport_series, value.passport_number, value.passport_issue_date, value.passport_issued_by,
                value.region, value.locality, value.street, value.house, value.building, value.apartment,
                value.department_id, value.position_id
            ]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateEmp = async (req, res) => {
    const { error: idError } = idSchema.validate(req.params);
    if (idError) return res.status(400).json({ error: idError.details[0].message });

    const { id, created_at, updated_at, deleted_at, ...data } = req.body;
    const { error, value } = EmpSchema.validate(data);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
        const check = await pool.query("SELECT 1 FROM employees WHERE id = $1 AND is_deleted = FALSE", [req.params.id]);
        if (!check.rowCount) return res.status(404).json({ error: "Сотрудник не найден" });

        const result = await pool.query(
            `UPDATE employees 
             SET first_name = $1, last_name = $2, middle_name = $3, birth_date = $4, 
                 passport_series = $5, passport_number = $6, passport_issue_date = $7, passport_issued_by = $8,
                 region = $9, locality = $10, street = $11, house = $12, building = $13, apartment = $14, 
                 department_id = $15, position_id = $16,
                 updated_at = NOW() 
             WHERE id = $17 
             RETURNING *`,
            [
                value.first_name, value.last_name, value.middle_name, value.birth_date, 
                value.passport_series, value.passport_number, value.passport_issue_date, value.passport_issued_by,
                value.region, value.locality, value.street, value.house, value.building, value.apartment,
                value.department_id, value.position_id,
                req.params.id
            ]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteEmp = async (req, res) => {
    const { error } = idSchema.validate(req.params);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
        const result = await pool.query(
            "UPDATE employees SET is_deleted = TRUE, deleted_at = NOW() WHERE id = $1 RETURNING *", 
            [req.params.id]
        );
        if (!result.rowCount) return res.status(404).json({ error: "Сотрудник не найден" });

        res.json({ message: "Сотрудник удален" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getEmp, getEmpById, createEmp, updateEmp, deleteEmp };