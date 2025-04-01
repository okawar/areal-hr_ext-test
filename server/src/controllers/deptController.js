const Joi = require("joi");
const pool = require("../database/database");

const idSchema = Joi.object({
    id: Joi.number().integer().positive().required()
});

const deptSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    organization_id: Joi.number().integer().positive().required(),
    parent_id: Joi.number().integer().positive().allow(null).optional(),
    comment: Joi.string().allow("").optional()
});

const getDepts = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM departments WHERE is_deleted = FALSE");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getDeptById = async (req, res) => {
    const { error } = idSchema.validate(req.params);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
        const result = await pool.query("SELECT * FROM departments WHERE id = $1 AND is_deleted = FALSE", [req.params.id]);
        if (!result.rows.length) return res.status(404).json({ error: "Отдел не найден" });

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const createDept = async (req, res) => {
    const { error, value } = deptSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
        const result = await pool.query(
            "INSERT INTO departments (name, organization_id, parent_id, comment, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *",
            [value.name, value.organization_id, value.parent_id, value.comment]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateDept = async (req, res) => {
    const { error: idError } = idSchema.validate(req.params);
    if (idError) return res.status(400).json({ error: idError.details[0].message });

    const { id, is_deleted, created_at, updated_at, deleted_at, ...data } = req.body;
    const { error, value } = deptSchema.validate(data);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
        const check = await pool.query("SELECT 1 FROM departments WHERE id = $1 AND is_deleted = FALSE", [req.params.id]);
        if (!check.rowCount) return res.status(404).json({ error: "Отдел не найден" });

        const result = await pool.query(
            "UPDATE departments SET name = $1, organization_id = $2, parent_id = $3, comment = $4, updated_at = NOW() WHERE id = $5 RETURNING *",
            [value.name, value.organization_id, value.parent_id, value.comment, req.params.id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteDept = async (req, res) => {
    const { error } = idSchema.validate(req.params);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
        const result = await pool.query("UPDATE departments SET is_deleted = TRUE, deleted_at = NOW() WHERE id = $1 RETURNING *", [req.params.id]);
        if (!result.rowCount) return res.status(404).json({ error: "Отдел не найден" });

        res.json({ message: "Отдел удален" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getDepts, getDeptById, createDept, updateDept, deleteDept };
