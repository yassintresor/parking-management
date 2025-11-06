const Booking = require('../models/booking.model');
const ParkingSpace = require('../models/parking-space.model');
const Vehicle = require('../models/vehicle.model');

const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll();
    res.json({
      success: true,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
      error: error.message
    });
  }
};

const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching booking',
      error: error.message
    });
  }
};

const createBooking = async (req, res) => {
  try {
    const { space_id, vehicle_id, start_time, end_time } = req.body;
    const user_id = req.user.id;
    
    // Check if space is available
    const space = await ParkingSpace.findById(space_id);
    if (!space || space.status !== 'AVAILABLE') {
      return res.status(400).json({
        success: false,
        message: 'Parking space is not available'
      });
    }
    
    // Check if vehicle belongs to user
    const vehicle = await Vehicle.findById(vehicle_id);
    if (!vehicle || vehicle.user_id !== user_id) {
      return res.status(400).json({
        success: false,
        message: 'Invalid vehicle'
      });
    }
    
    // Create booking
    const bookingId = await Booking.create({
      user_id,
      space_id,
      vehicle_id,
      start_time,
      end_time
    });
    
    // Update space status to RESERVED
    await ParkingSpace.updateStatus(space_id, 'RESERVED');
    
    const booking = await Booking.findById(bookingId);
    
    res.status(201).json({
      success: true,
      data: booking,
      message: 'Booking created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating booking',
      error: error.message
    });
  }
};

const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { start_time, end_time } = req.body;
    const user_id = req.user.id;
    
    // Check if booking exists and belongs to user
    const booking = await Booking.findById(id);
    if (!booking || booking.user_id !== user_id) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    const updated = await Booking.update(id, {
      start_time,
      end_time
    });
    
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    const updatedBooking = await Booking.findById(id);
    
    res.json({
      success: true,
      data: updatedBooking,
      message: 'Booking updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating booking',
      error: error.message
    });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;
    
    // Check if booking exists and belongs to user
    const booking = await Booking.findById(id);
    if (!booking || booking.user_id !== user_id) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    const deleted = await Booking.delete(id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    // Update space status back to AVAILABLE
    await ParkingSpace.updateStatus(booking.space_id, 'AVAILABLE');
    
    res.json({
      success: true,
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting booking',
      error: error.message
    });
  }
};

const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;
    const bookings = await Booking.findByUserId(userId);
    
    res.json({
      success: true,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user bookings',
      error: error.message
    });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;
    
    // Check if booking exists and belongs to user
    const booking = await Booking.findById(id);
    if (!booking || booking.user_id !== user_id) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    const updated = await Booking.updateStatus(id, 'CANCELLED');
    
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    // Update space status back to AVAILABLE
    await ParkingSpace.updateStatus(booking.space_id, 'AVAILABLE');
    
    const updatedBooking = await Booking.findById(id);
    
    res.json({
      success: true,
      data: updatedBooking,
      message: 'Booking cancelled successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error cancelling booking',
      error: error.message
    });
  }
};

module.exports = {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
  getUserBookings,
  cancelBooking
};