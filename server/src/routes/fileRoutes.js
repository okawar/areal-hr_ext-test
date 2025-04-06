const express = require('express')

const {getFile, getFileById, createFile, updateFile, deleteFile} = require('../controllers/fileController')

const router = express.Router()

router.get("/", getFile)
router.get("/:id", getFileById)
router.post("/", createFile)
router.put("/:id", updateFile)
router.delete("/:id", deleteFile)

module.exports = router;