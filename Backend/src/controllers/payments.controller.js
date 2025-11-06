const Payment = require('../models/payment.model');
const Booking = require('../models/booking.model');

const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll();
    res.json({
      success: true,
      data: payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching payments',
      error: error.message
    });
  }
};

const getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findById(id);
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }
    
    res.json({
      success: true,
      data: payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching payment',
      error: error.message
    });
  }
};

const createPayment = async (req, res) => {
  try {
    const { booking_id, amount, currency, method } = req.body;
    const user_id = req.user.id;
    
    // Check if booking exists and belongs to user
    const booking = await Booking.findById(booking_id);
    if (!booking || booking.user_id !== user_id) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking'
      });
    }
    
    const paymentId = await Payment.create({
      booking_id,
      user_id,
      amount,
      currency,
      method
    });
    
    const payment = await Payment.findById(paymentId);
    
    res.status(201).json({
      success: true,
      data: payment,
      message: 'Payment created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating payment',
      error: error.message
    });
  }
};

const getUserPayments = async (req, res) => {
  try {
    const { userId } = req.params;
    const payments = await Payment.findByUserId(userId);
    
    res.json({
      success: true,
      data: payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user payments',
      error: error.message
    });
  }
};

const refundPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;
    
    // Check if payment exists and belongs to user
    const payment = await Payment.findById(id);
    if (!payment || payment.user_id !== user_id) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }
    
    const updated = await Payment.updateStatus(id, 'REFUNDED');
    
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }
    
    const updatedPayment = await Payment.findById(id);
    
    res.json({
      success: true,
      data: updatedPayment,
      message: 'Payment refunded successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error refunding payment',
      error: error.message
    });
  }
};

module.exports = {
  getAllPayments,
  getPaymentById,
  createPayment,
  getUserPayments,
  refundPayment
};