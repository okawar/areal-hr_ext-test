const express = require('express')

const {getDepts, getDeptById, createDept, updateDept, deleteDept} = require('../controllers/deptController')

const router = express.Router()

router.get("/", getDepts)
router.get("/:id", getDeptById)
router.post("/", createDept)
router.put("/:id", updateDept)
router.delete("/:id", deleteDept)

module.exports = router;