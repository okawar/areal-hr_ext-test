const express = require('express');
const {
  getPos,
  getPosById,
  createPos,
  updatePos,
  deletePos,
} = require('../controllers/posController');

const { ensureAuthenticated } = require('../middleware/auth/auth');

const router = express.Router();

router.use(ensureAuthenticated);

router.get('/', getPos);
router.get('/:id', getPosById);
router.post('/', createPos);
router.put('/:id', updatePos);
router.delete('/:id', deletePos);

module.exports = router;
