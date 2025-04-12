const pool = require("../database/database");
const fs = require('fs');
const path = require('path');

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
    const { employee_id, comment = "" } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ error: "Файл не загружен" });

    try {
        const result = await pool.query(
            `INSERT INTO files (employee_id, file_name, file_path, comment, created_at)
             VALUES ($1, $2, $3, $4, NOW()) RETURNING *`,
            [employee_id, file.originalname, file.filename, comment]
        );

        const createdFile = result.rows[0];


        res.json(createdFile);
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
        const currentResult = await pool.query(
            "SELECT * FROM files WHERE id = $1 AND is_deleted = FALSE", 
            [req.params.id]
        );
        
        if (!currentResult.rowCount) return res.status(404).json({ error: "Файл не найден" });
        const currentFile = currentResult.rows[0];
        
        const result = await pool.query(
            `UPDATE files SET employee_id = $1, file_name = $2, file_path = $3, comment = $4, updated_at = NOW() WHERE id = $5 RETURNING *`,
            [value.employee_id, value.file_name, value.file_path, value.comment || "", req.params.id]
        );
        
        const updatedFile = result.rows[0];
        
        res.json(updatedFile);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteFile = async (req, res) => {
    const { error } = idSchema.validate(req.params);
    if (error) return res.status(400).json({ error: error.details[0].message });
    
    try {
        const currentResult = await pool.query(
            "SELECT * FROM files WHERE id = $1 AND is_deleted = FALSE", 
            [req.params.id]
        );
        
        if (!currentResult.rowCount) return res.status(404).json({ error: "Файл не найден" });
        const currentFile = currentResult.rows[0];
        
        const result = await pool.query(
            "UPDATE files SET is_deleted = TRUE, deleted_at = NOW() WHERE id = $1 RETURNING *", 
            [req.params.id]
        );
        
        
        res.json({ message: "Файл удален" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const downloadFile = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query("SELECT * FROM files WHERE id = $1 AND is_deleted = FALSE", [id]);
        if (!result.rowCount) return res.status(404).json({ error: "Файл не найден" });

        const file = result.rows[0];
        const filePath = path.resolve(__dirname, "../uploads", file.file_path);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: "Файл не найден на сервере" });
        }

        res.download(filePath, file.file_name);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getFile, getFileById, createFile, updateFile, deleteFile, downloadFile };
