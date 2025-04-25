const express = require('express');

const {
  getChangeHistory,
  getChangeHistoryById,
  createChangeHistory,
  updateChangeHistory,
  deleteChangeHistory,
} = require('../controllers/changeHistoryController');

const router = express.Router();

const { ensureAuthenticated } = require('../middleware/auth/auth');
router.use(ensureAuthenticated);

router.get('/', getChangeHistory);
router.get('/:id', getChangeHistoryById);
router.post('/', createChangeHistory);
router.put('/:id', updateChangeHistory);
router.delete('/:id', deleteChangeHistory);

module.exports = router;
