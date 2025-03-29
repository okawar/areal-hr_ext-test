const express = require('express')

const {getOrgs, getOrgById, createOrg, updateOrg, deleteOrg} = require('../controllers/orgController')

const router = express.Router()

router.get("/", getOrgs)
router.get("/:id", getOrgById)
router.post("/", createOrg)
router.put("/:id", updateOrg)
router.delete("/:id", deleteOrg)

module.exports = router;