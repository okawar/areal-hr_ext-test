const pool = require('../database/database')

const getOrgs = async (req, res) => {
    try{
        const result = await pool.query("SELECT * FROM organizations WHERE is_deleted = FALSE")
        res.json(result.rows)
    }
    catch (err){
        res.status(500).json({error: err.message});
    }
}

const getOrgById = async (req, res) => {
    const {id} = req.params
    try{
        const result = await pool.query("SELECT * FROM organizations WHERE id = $1 AND is_deleted = false", [id])
        res.json(result.rows[0] || {})
    }
    catch (err){
        res.status(500).json({error: err.message})
    }
}

const createOrg = async (req, res) => {
    const {name, comment} = req.body 
    try{
        const result = await pool.query("INSERT INTO organizations (name, comment, created_at) VALUES ($1, $2, NOW()) RETURNING *", [name, comment])
        res.json(result.rows[0])
    }
    catch (err){
        res.status(500).json({error: err.message})
    }
}

const updateOrg = async (req, res) => {
    const {id} = req.params
    const {name, comment} = req.body

    try {
        const result = await pool.query( 'UPDATE organizations SET name = $1, comment = $2, updated_at = NOW() WHERE id = $3 RETURNING *',[name, comment, id])

        res.json(result.rows[0])
    }
    catch (err) {
        res.status(500).json({error: err.message})
    }
} 

const deleteOrg = async (req, res) => {
    const {id} = req.params
    try{
        const result = await pool.query('UPDATE organizations SET is_deleted = true, deleted_at = NOW() WHERE id = $1', [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Организация не найдена" });
        }

        res.json({message: "Организация удалена"})
    }

    
    catch (err) {
        res.status(500).json({error: err.message})
    }
}
   
module.exports = { getOrgs, getOrgById, createOrg, updateOrg, deleteOrg };