const pool = require('../database/database');
const Joi = require('joi');

const idSchema = Joi.object({
    id: Joi.number().integer().positive().required()
});

const updatePositionSchema = Joi.object({
    name: Joi.string().min(2).max(100).required()
});


const getPos = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM positions WHERE is_deleted = FALSE");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getPosById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query("SELECT * FROM positions WHERE id = $1 AND is_deleted = FALSE", [id]);
        res.json(result.rows[0] || {});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const createPos = async (req, res) => {
    const { error, value } = positionSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    
    try {
        const result = await pool.query('INSERT INTO positions (name, created_at) VALUES ($1, NOW()) RETURNING *', [value.name]);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updatePos = async (req, res) => {
    const { error: idError } = idSchema.validate(req.params);
    if (idError) {
        return res.status(400).json({ error: idError.details[0].message });
    }

    const { id, is_deleted, created_at, updated_at, deleted_at, ...data } = req.body;

    const { error, value } = updatePositionSchema.validate(data);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        const check = await pool.query("SELECT 1 FROM positions WHERE id = $1 AND is_deleted = FALSE", [req.params.id]);
        if (check.rowCount === 0) {
            return res.status(404).json({ error: "Должность не найдена" });
        }

        const result = await pool.query(
            "UPDATE positions SET name = $1, updated_at = NOW() WHERE id = $2 RETURNING *",
            [value.name, req.params.id]
        );

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deletePos = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('UPDATE positions SET is_deleted = TRUE, deleted_at = NOW() WHERE id = $1 RETURNING *', [id]);
        
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Должность не найдена" });
        }
        
        res.json({ message: "Должность удалена" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getPos, getPosById, createPos, updatePos, deletePos };
