const express = require('express');

const {
  getOperations,
  getOperationById,
  createOperation,
  updateOperation,
  deleteOperation,
} = require('../controllers/hrOpController');

const router = express.Router();

router.get('/', getOperations);
router.get('/:id', getOperationById);
router.post('/', createOperation);
router.put('/:id', updateOperation);
router.delete('/:id', deleteOperation);

module.exports = router;
