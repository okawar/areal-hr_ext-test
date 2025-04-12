const express = require('express');
const upload = require('../middleware/upload');
const {
    getFile,
    getFileById,
    createFile,
    updateFile,
    deleteFile,
    downloadFile
} = require('../controllers/fileController');

const router = express.Router();

router.get("/", getFile);
router.get("/:id", getFileById);
router.get("/:id/download", downloadFile);
router.post("/", upload.single("file"), createFile);
router.put("/:id", updateFile);
router.delete("/:id", deleteFile);

module.exports = router;
