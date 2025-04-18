const express = require('express');

const {
  getEmp,
  getEmpById,
  createEmp,
  updateEmp,
  deleteEmp,
} = require('../controllers/empController');

const router = express.Router();

router.get('/', getEmp);
router.get('/:id', getEmpById);
router.post('/', createEmp);
router.put('/:id', updateEmp);
router.delete('/:id', deleteEmp);

module.exports = router;
