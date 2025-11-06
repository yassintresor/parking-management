const Vehicle = require('../models/vehicle.model');

const getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.findAll();
    res.json({
      success: true,
      data: vehicles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching vehicles',
      error: error.message
    });
  }
};

const getVehicleById = async (req, res) => {
  try {
    const { id } = req.params;
    const vehicle = await Vehicle.findById(id);
    
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }
    
    res.json({
      success: true,
      data: vehicle
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching vehicle',
      error: error.message
    });
  }
};

const createVehicle = async (req, res) => {
  try {
    const { license_plate, make, model, color } = req.body;
    const user_id = req.user.id;
    
    const vehicleId = await Vehicle.create({
      user_id,
      license_plate,
      make,
      model,
      color
    });
    
    const vehicle = await Vehicle.findById(vehicleId);
    
    res.status(201).json({
      success: true,
      data: vehicle,
      message: 'Vehicle created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating vehicle',
      error: error.message
    });
  }
};

const updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const { license_plate, make, model, color } = req.body;
    const user_id = req.user.id;
    
    // Check if vehicle exists and belongs to user
    const vehicle = await Vehicle.findById(id);
    if (!vehicle || vehicle.user_id !== user_id) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }
    
    const updated = await Vehicle.update(id, {
      license_plate,
      make,
      model,
      color
    });
    
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }
    
    const updatedVehicle = await Vehicle.findById(id);
    
    res.json({
      success: true,
      data: updatedVehicle,
      message: 'Vehicle updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating vehicle',
      error: error.message
    });
  }
};

const deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;
    
    // Check if vehicle exists and belongs to user
    const vehicle = await Vehicle.findById(id);
    if (!vehicle || vehicle.user_id !== user_id) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }
    
    const deleted = await Vehicle.delete(id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Vehicle deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting vehicle',
      error: error.message
    });
  }
};

const getUserVehicles = async (req, res) => {
  try {
    const { userId } = req.params;
    const vehicles = await Vehicle.findByUserId(userId);
    
    res.json({
      success: true,
      data: vehicles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user vehicles',
      error: error.message
    });
  }
};

module.exports = {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getUserVehicles
};