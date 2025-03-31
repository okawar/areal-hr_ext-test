const pool = require('../database/database')

const getDepts = async (req, res) => {
    try{
        const result = await pool.query("SELECT * FROM departments WHERE is_deleted = FALSE")
        res.json(result.rows)
    }
    catch (err){
        res.status(500).json({error: err.message});
    }
}

const getDeptById = async (req, res) => {
    const {id} = req.params
    try{
        const result = await pool.query("SELECT * FROM departments WHERE id = $1 AND is_deleted = false", [id])
        res.json(result.rows[0] || {})
    }
    catch (err){
        res.status(500).json({error: err.message})
    }
}

const createDept = async (req, res) => {
    const { name, organization_id, parent_id, comment } = req.body;
    try{
        const result = await pool.query('INSERT INTO departments (name, organization_id, parent_id, comment, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
      [name, organization_id, parent_id, comment])
        res.json(result.rows[0])
    }
    catch (err){
        res.status(500).json({error: err.message})
    }
}

const updateDept = async (req, res) => {
    const {id} = req.params
    const { name, organization_id, parent_id, comment } = req.body;


    try {
        const result = await pool.query( 'UPDATE departments SET name = $1, organization_id = $2, parent_id = $3, comment = $4, updated_at = NOW() WHERE id = $5 RETURNING *',
            [name, organization_id, parent_id, comment, id])

        res.json(result.rows[0])
    }
    catch (err) {
        res.status(500).json({error: err.message})
    }
} 

const deleteDept = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'UPDATE departments SET is_deleted = true, deleted_at = NOW() WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Отдел не найден" });
        }

        res.json({ message: "Отдел успешно удален" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};
   
module.exports = { getDepts, getDeptById, createDept, updateDept, deleteDept };