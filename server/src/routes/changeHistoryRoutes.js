const express = require('express')

const {getChangeHistory, getChangeHistoryById, createChangeHistory, updateChangeHistory, deleteChangeHistory} = require('../controllers/changeHistoryController')

const router = express.Router()

router.get("/", getChangeHistory)
router.get("/:id", getChangeHistoryById)
router.post("/", createChangeHistory)
router.put("/:id", updateChangeHistory)
router.delete("/:id", deleteChangeHistory)

module.exports = router;