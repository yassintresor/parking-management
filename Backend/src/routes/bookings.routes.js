const router = require('express').Router();
const { auth } = require('../middlewares/auth.middleware');
const { 
  getAllBookings, 
  getBookingById, 
  createBooking, 
  updateBooking, 
  deleteBooking,
  getUserBookings,
  cancelBooking
} = require('../controllers/bookings.controller');

// User routes
router.get('/', auth, getAllBookings);
router.get('/:id', auth, getBookingById);
router.post('/', auth, createBooking);
router.put('/:id', auth, updateBooking);
router.delete('/:id', auth, deleteBooking);
router.get('/user/:userId', auth, getUserBookings);
router.post('/:id/cancel', auth, cancelBooking);

module.exports = router;