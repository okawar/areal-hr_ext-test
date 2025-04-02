const Joi = require("joi");
const pool = require("../database/database");
const idSchema = Joi.object({
    id: Joi.number().integer().positive().required()
});
const orgSchema = Joi.object({
    id: Joi.number().integer().optional(),
    name: Joi.string().min(2).max(100).required(),
    comment: Joi.string().allow("").optional()
});
const getOrgs = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM organizations WHERE is_deleted = FALSE");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
const getOrgById = async (req, res) => {
    const { error } = idSchema.validate(req.params);
    if (error) return res.status(400).json({ error: error.details[0].message });
    try {
        const result = await pool.query("SELECT * FROM organizations WHERE id = $1 AND is_deleted = FALSE", [req.params.id]);
        if (!result.rows.length) return res.status(404).json({ error: "Организация не найдена" });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
const createOrg = async (req, res) => {
    console.log("Полученные данные:", req.body);
    const { error, value } = orgSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    try {
        const result = await pool.query(
            "INSERT INTO organizations (name, comment, created_at) VALUES ($1, $2, NOW()) RETURNING id, name, comment, created_at",
            [value.name, value.comment || ""] // Ensure comment is always a string
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ error: err.message });
    }
};
const updateOrg = async (req, res) => {
    const { error: idError } = idSchema.validate(req.params);
    if (idError) return res.status(400).json({ error: idError.details[0].message });
    
    // Remove fields that shouldn't be updated
    const { id, is_deleted, created_at, updated_at, deleted_at, ...data } = req.body;
    
    const { error, value } = orgSchema.validate(data);
    if (error) return res.status(400).json({ error: error.details[0].message });
    
    try {
        const check = await pool.query("SELECT 1 FROM organizations WHERE id = $1 AND is_deleted = FALSE", [req.params.id]);
        if (!check.rowCount) return res.status(404).json({ error: "Организация не найдена" });
        
        const result = await pool.query(
            "UPDATE organizations SET name = $1, comment = $2, updated_at = NOW() WHERE id = $3 RETURNING *",
            [value.name, value.comment || "", req.params.id] // Ensure comment is always a string
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ error: err.message });
    }
};
const deleteOrg = async (req, res) => {
    const { error } = idSchema.validate(req.params);
    if (error) return res.status(400).json({ error: error.details[0].message });
    try {
        const result = await pool.query("UPDATE organizations SET is_deleted = TRUE, deleted_at = NOW() WHERE id = $1 RETURNING *", [req.params.id]);
        if (!result.rowCount) return res.status(404).json({ error: "Организация не найдена" });
        res.json({ message: "Организация удалена" });
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ error: err.message });
    }
};
module.exports = { getOrgs, getOrgById, createOrg, updateOrg, deleteOrg };