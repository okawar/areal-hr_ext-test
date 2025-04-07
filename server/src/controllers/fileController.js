const pool = require("../database/database");

const {fileSchema} = require("../validation/file.schema")
const { idSchema } = require("../validation/id.schema");

const getFile = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT files.*, 
                    employees.last_name, 
                    employees.first_name, 
                    employees.middle_name
             FROM files
             JOIN employees ON files.employee_id = employees.id
             WHERE files.is_deleted = FALSE`
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getFileById = async (req, res) => {
    const { error } = idSchema.validate(req.params);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
        const result = await pool.query(
            `SELECT files.*, 
                    employees.last_name, 
                    employees.first_name, 
                    employees.middle_name
             FROM files
             JOIN employees ON files.employee_id = employees.id
             WHERE files.id = $1 AND files.is_deleted = FALSE`, 
            [req.params.id]
        );
        if (!result.rows.length) return res.status(404).json({ error: "Файл не найден" });

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


const createFile = async (req, res) => {
    const { error, value } = fileSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
        const result = await pool.query(
            "INSERT INTO files (employee_id, file_name, file_path, comment, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *",
            [value.employee_id, value.file_name, value.file_path, value.comment || ""]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateFile = async (req, res) => {
    const { error: idError } = idSchema.validate(req.params);
    if (idError) return res.status(400).json({ error: idError.details[0].message });

    const { id, is_deleted, created_at, updated_at, deleted_at, ...data } = req.body;
    const { error, value } = fileSchema.validate(data);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
        const check = await pool.query("SELECT 1 FROM files WHERE id = $1 AND is_deleted = FALSE", [req.params.id]);
        if (!check.rowCount) return res.status(404).json({ error: "Файл не найден" });

        const result = await pool.query(
            `UPDATE files SET employee_id = $1, file_name = $2, file_path = $3, comment = $4, updated_at = NOW() WHERE id = $5 RETURNING *`,
            [value.employee_id, value.file_name, value.file_path, value.comment || "", req.params.id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteFile = async (req, res) => {
    const { error } = idSchema.validate(req.params);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
        const result = await pool.query("UPDATE files SET is_deleted = TRUE, deleted_at = NOW() WHERE id = $1 RETURNING *", [req.params.id]);
        if (!result.rowCount) return res.status(404).json({ error: "Файл не найден" });

        res.json({ message: "Файл удален" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getFile, getFileById, createFile, updateFile, deleteFile };
