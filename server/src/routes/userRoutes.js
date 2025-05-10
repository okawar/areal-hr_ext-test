const express = require('express');
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUsersForHistory,
} = require('../controllers/userController');

const router = express.Router();

const { ensureAuthenticated } = require('../middleware/auth/auth');

router.use(ensureAuthenticated);

router.get('/for-history', getUsersForHistory);
router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
