const pool = require('../database/database')

const getPos = async (req, res) => {
    try{
        const result = await pool.query("SELECT * FROM positions WHERE is_deleted = FALSE")
        res.json(result.rows)
    }
    catch (err){
        res.status(500).json({error: err.message});
    }
}

const getPosById = async (req, res) => {
    const {id} = req.params
    try{
        const result = await pool.query("SELECT * FROM positions WHERE id = $1 AND is_deleted = false", [id])
        res.json(result.rows[0] || {})
    }
    catch (err){
        res.status(500).json({error: err.message})
    }
}

const createPos = async (req, res) => {
    const { name } = req.body;
    try{
        const result = await pool.query('INSERT INTO positions (name, created_at) VALUES ($1, NOW()) RETURNING *',
      [name])
        res.json(result.rows[0])
    }
    catch (err){
        res.status(500).json({error: err.message})
    }
}

const updatePos = async (req, res) => {
    const {id} = req.params
    const { name } = req.body;


    try {
        const result = await pool.query('UPDATE positions SET name = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [name, id])

        res.json(result.rows[0])
    }
    catch (err) {
        res.status(500).json({error: err.message})
    }
} 

const deletePos = async (req, res) => {
    const {id} = req.params
    try{
        const result = await pool.query( 'UPDATE positions SET is_deleted = true, deleted_at = NOW() WHERE id = $1 RETURNING *',
            [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Должность не найдена" });
        }

        res.json({message: "Должность удалена"})
    }
    catch (err) {
        res.status(500).json({error: err.message})
    }
}
   
module.exports = { getPos, getPosById, createPos, updatePos, deletePos };