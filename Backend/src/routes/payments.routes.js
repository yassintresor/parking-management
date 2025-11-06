const router = require('express').Router();
const { auth } = require('../middlewares/auth.middleware');
const { 
  getAllPayments, 
  getPaymentById, 
  createPayment, 
  getUserPayments,
  refundPayment
} = require('../controllers/payments.controller');

// User routes
router.get('/', auth, getAllPayments);
router.get('/:id', auth, getPaymentById);
router.post('/', auth, createPayment);
router.get('/user/:userId', auth, getUserPayments);
router.post('/:id/refund', auth, refundPayment);

module.exports = router;