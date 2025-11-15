const User = require('../models/user.model');
const Booking = require('../models/booking.model');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message
    });
  }
};

const createUser = async (req, res) => {
  try {
    const { email, password, name, phone, role } = req.body;
    
    console.log('Creating user with data:', { email, password: '****', name, phone, role });
    
    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      console.log('User already exists with email:', email);
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }
    
    // Validate required fields
    if (!email || !password || !name) {
      console.log('Missing required fields');
      return res.status(400).json({
        success: false,
        message: 'Email, password, and name are required'
      });
    }
    
    // Handle role - be more flexible
    let userRole = 'USER'; // Default role
    if (role) {
      // Convert to uppercase and check if it's a valid role
      const upperRole = role.toString().toUpperCase();
      const validRoles = ['ADMIN', 'OPERATOR', 'USER'];
      if (validRoles.includes(upperRole)) {
        userRole = upperRole;
      }
      // If role is not valid, we'll just use the default 'USER' role
    }
    
    console.log('Using role:', userRole);
    
    // Create new user with specified role
    const userId = await User.create({
      email,
      password,
      name,
      phone: phone || null, // Handle phone as nullable
      role: userRole
    });
    
    console.log('User created with ID:', userId);
    
    const user = await User.findById(userId);
    
    res.status(201).json({
      success: true,
      data: user,
      message: 'User created successfully'
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating user',
      error: error.message
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, role } = req.body;
    
    const updated = await User.update(id, { name, phone, role });
    
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const user = await User.findById(id);
    
    res.json({
      success: true,
      data: user,
      message: 'User updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: error.message
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await User.delete(id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message
    });
  }
};

const getUserBookings = async (req, res) => {
  try {
    const { id } = req.params;
    const bookings = await Booking.findByUserId(id);
    
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

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserBookings
};