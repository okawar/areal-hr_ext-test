const express = require('express');
const upload = require('../middleware/upload');

const {
  getEmp,
  getEmpById,
  createEmp,
  updateEmp,
  deleteEmp,
} = require('../controllers/empController');

const router = express.Router();

const { ensureAuthenticated } = require('../middleware/auth/auth');

router.use(ensureAuthenticated);

router.get('/', getEmp);
router.get('/:id', getEmpById);
router.post('/', createEmp);
router.put('/:id', updateEmp);
router.delete('/:id', deleteEmp);

module.exports = router;
