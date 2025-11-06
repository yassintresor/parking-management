const router = require('express').Router();
const { auth, checkRole } = require('../middlewares/auth.middleware');
const { 
  getAllUsers, 
  getUserById, 
  updateUser, 
  deleteUser,
  getUserBookings
} = require('../controllers/users.controller');

// Admin routes
router.get('/', auth, checkRole(['ADMIN']), getAllUsers);
router.get('/:id', auth, getUserById);
router.put('/:id', auth, checkRole(['ADMIN']), updateUser);
router.delete('/:id', auth, checkRole(['ADMIN']), deleteUser);

// User specific routes
router.get('/:id/bookings', auth, getUserBookings);

module.exports = router;