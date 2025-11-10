const ParkingSpace = require('../models/parking-space.model');

const getAllSpaces = async (req, res) => {
  try {
    const spaces = await ParkingSpace.findAll();
    res.json({
      success: true,
      data: spaces
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching parking spaces',
      error: error.message
    });
  }
};

const getSpaceById = async (req, res) => {
  try {
    const { id } = req.params;
    const space = await ParkingSpace.findById(id);
    
    if (!space) {
      return res.status(404).json({
        success: false,
        message: 'Parking space not found'
      });
    }
    
    res.json({
      success: true,
      data: space
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching parking space',
      error: error.message
    });
  }
};

const createSpace = async (req, res) => {
  try {
    const { space_number, location, type, hourly_rate } = req.body;
    
    const spaceId = await ParkingSpace.create({
      space_number,
      location,
      type,
      hourly_rate
    });
    
    
    const space = await ParkingSpace.findById(spaceId);
    
    res.status(201).json({
      success: true,
      data: space,
      message: 'Parking space created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating parking space',
      error: error.message
    });
  }
};

const updateSpace = async (req, res) => {
  try {
    const { id } = req.params;
    const { space_number, location, type, hourly_rate } = req.body;
    
    const updated = await ParkingSpace.update(id, {
      space_number,
      location,
      type,
      hourly_rate
    });
    
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Parking space not found'
      });
    }
    
    const space = await ParkingSpace.findById(id);
    
    res.json({
      success: true,
      data: space,
      message: 'Parking space updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating parking space',
      error: error.message
    });
  }
};

const deleteSpace = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ParkingSpace.delete(id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Parking space not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Parking space deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting parking space',
      error: error.message
    });
  }
};

const getAvailableSpaces = async (req, res) => {
  try {
    const spaces = await ParkingSpace.findAvailable();
    res.json({
      success: true,
      data: spaces
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching available parking spaces',
      error: error.message
    });
  }
};

const updateSpaceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const updated = await ParkingSpace.updateStatus(id, status);
    
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Parking space not found'
      });
    }
    
    const space = await ParkingSpace.findById(id);
    
    res.json({
      success: true,
      data: space,
      message: 'Parking space status updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating parking space status',
      error: error.message
    });
  }
};

const getAvailableSpacesCount = async (req, res) => {
  try {
    const count = await ParkingSpace.getAvailableCount();
    res.json({
      success: true,
      data: { count }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching available spaces count',
      error: error.message
    });
  }
};

module.exports = {
  getAllSpaces,
  getSpaceById,
  createSpace,
  updateSpace,
  deleteSpace,
  getAvailableSpaces,
  updateSpaceStatus,
  getAvailableSpacesCount
};