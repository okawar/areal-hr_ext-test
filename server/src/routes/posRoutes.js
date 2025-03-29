const express = require('express')

const {getPos, getPosById, createPos, updatePos, deletePos} = require('../controllers/posController')

const router = express.Router()

router.get("/", getPos)
router.get("/:id", getPosById)
router.post("/", createPos)
router.put("/:id", updatePos)
router.delete("/:id", deletePos)

module.exports = router;