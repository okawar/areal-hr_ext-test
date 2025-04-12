const pool = require('../database/database');

const {positionSchema} = require("../validation/pos.schema")
const {idSchema} = require("../validation/id.schema")

const { logChanges } = require('../utils/historyLogger');

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
        if (!result.rows.length) return res.status(404).json({ error: "Должность не найдена" });
        res.json(result.rows[0]);
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
        const result = await pool.query(
            'INSERT INTO positions (name, created_at) VALUES ($1, NOW()) RETURNING *',
            [value.name]
        );
        
        const createdPos = result.rows[0];
        
        await logChanges('position', createdPos.id, null, createdPos, 'create', req.user?.id || 1);
        
        res.json(createdPos);
    } catch (err) {
        if (err.code === '23505') {
            return res.status(400).json({ error: 'Должность с таким названием уже существует' });
        }
        res.status(500).json({ error: err.message });
    }
};

const updatePos = async (req, res) => {
    const { error: idError } = idSchema.validate(req.params);
    if (idError) {
        return res.status(400).json({ error: idError.details[0].message });
    }
    
    const { id, is_deleted, created_at, updated_at, deleted_at, ...data } = req.body;
    const { error, value } = positionSchema.validate(data);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    
    try {
        const currentResult = await pool.query(
            "SELECT * FROM positions WHERE id = $1 AND is_deleted = FALSE", 
            [req.params.id]
        );
        
        if (!currentResult.rowCount) return res.status(404).json({ error: "Должность не найдена" });
        const currentPos = currentResult.rows[0];
        
        const result = await pool.query(
            "UPDATE positions SET name = $1, updated_at = NOW() WHERE id = $2 RETURNING *",
            [value.name, req.params.id]
        );
        
        const updatedPos = result.rows[0];
        
        await logChanges('position', req.params.id, currentPos, updatedPos, 'update', req.user?.id || 1);
        
        res.json(updatedPos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deletePos = async (req, res) => {
    const { id } = req.params;
    try {
        const currentResult = await pool.query(
            "SELECT * FROM positions WHERE id = $1 AND is_deleted = FALSE", 
            [id]
        );
        
        if (!currentResult.rowCount) return res.status(404).json({ error: "Должность не найдена" });
        const currentPos = currentResult.rows[0];
        
        const result = await pool.query(
            'UPDATE positions SET is_deleted = TRUE, deleted_at = NOW() WHERE id = $1 RETURNING *', 
            [id]
        );
        
        await logChanges('position', id, currentPos, null, 'delete', req.user?.id || 1);
        
        res.json({ message: "Должность удалена" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getPos, getPosById, createPos, updatePos, deletePos };
