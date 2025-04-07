const Joi = require("joi");
const pool = require("../database/database");


const idSchema = Joi.object({ id: Joi.number().integer().positive().required() });


const ChangeHistorySchema = Joi.object({
    change_time: Joi.date().default(() => new Date()),
    change_by: Joi.number().integer().positive().default(1),
    object_type: Joi.string().valid('organization', 'department', 'position', 'employee').required(),
    object_id: Joi.number().integer().positive().required(),
    changed_fields: Joi.object().required(),
    created_at: Joi.date().default(() => new Date())
}).unknown(true);


const getChangeHistory = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT * FROM change_history
            ORDER BY change_time DESC
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


const getChangeHistoryById = async (req, res) => {
    const { error } = idSchema.validate(req.params);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
        const result = await pool.query(`
            SELECT * FROM change_history
            WHERE id = $1
        `, [req.params.id]);
        
        if (!result.rows.length) return res.status(404).json({ error: "Запись истории изменений не найдена" });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


const getChangeHistoryByObject = async (req, res) => {
    const objectSchema = Joi.object({ 
        object_type: Joi.string().valid('organization', 'department', 'position', 'employee').required(),
        object_id: Joi.number().integer().positive().required()
    });
    
    const { error } = objectSchema.validate(req.params);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
        const result = await pool.query(`
            SELECT * FROM change_history
            WHERE object_type = $1 AND object_id = $2
            ORDER BY change_time DESC
        `, [req.params.object_type, req.params.object_id]);
        
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


const createChangeHistory = async (req, res) => {
    const { error, value } = ChangeHistorySchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });


    const change_by = 1; 

    try {
        const result = await pool.query(
            `INSERT INTO change_history 
                (change_time, change_by, object_type, object_id, changed_fields, created_at) 
             VALUES (NOW(), $1, $2, $3, $4, NOW()) 
             RETURNING *`,
            [
                change_by,
                value.object_type,
                value.object_id,
                value.changed_fields
            ]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateChangeHistory = async (req, res) => {
    const { error: idError } = idSchema.validate(req.params);
    if (idError) return res.status(400).json({ error: idError.details[0].message });

    const { id, created_at, ...data } = req.body;
    const { error, value } = ChangeHistorySchema.validate(data);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const change_by = 1; 

    try {
        const check = await pool.query("SELECT 1 FROM change_history WHERE id = $1", [req.params.id]);
        if (!check.rowCount) return res.status(404).json({ error: "Запись истории изменений не найдена" });

        const result = await pool.query(
            `UPDATE change_history 
             SET change_time = $1, change_by = $2, object_type = $3, object_id = $4, changed_fields = $5
             WHERE id = $6 
             RETURNING *`,
            [
                value.change_time || new Date(),
                change_by,
                value.object_type,
                value.object_id,
                value.changed_fields,
                req.params.id
            ]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteChangeHistory = async (req, res) => {
    const { error } = idSchema.validate(req.params);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
        const result = await pool.query(
            "DELETE FROM change_history WHERE id = $1 RETURNING *", 
            [req.params.id]
        );
        if (!result.rowCount) return res.status(404).json({ error: "Запись истории изменений не найдена" });

        res.json({ message: "Запись истории изменений удалена" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const logChange = async (objectType, objectId, changedFields) => {
    try {
        const { error, value } = Joi.object({
            object_type: Joi.string().valid('organization', 'department', 'position', 'employee').required(),
            object_id: Joi.number().integer().positive().required(),
            changed_fields: Joi.object().required()
        }).validate({ object_type: objectType, object_id: objectId, changed_fields: changedFields });
        
        if (error) {
            console.error('Ошибка валидации при логировании изменений:', error);
            return null;
        }
        
        const change_by = 1;
        
        const result = await pool.query(
            `INSERT INTO change_history 
                (change_time, change_by, object_type, object_id, changed_fields, created_at) 
             VALUES (NOW(), $1, $2, $3, $4, NOW()) 
             RETURNING *`,
            [
                change_by,
                objectType,
                objectId,
                changedFields
            ]
        );
        return result.rows[0];
    } catch (err) {
        console.error('Ошибка при логировании изменений:', err);
        return null;
    }
};

module.exports = { 
    getChangeHistory, 
    getChangeHistoryById, 
    getChangeHistoryByObject,
    createChangeHistory, 
    updateChangeHistory, 
    deleteChangeHistory,
    logChange
};