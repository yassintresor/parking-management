const router = require('express').Router();
const { auth } = require('../middlewares/auth.middleware');
const { 
  getAllVehicles, 
  getVehicleById, 
  createVehicle, 
  updateVehicle, 
  deleteVehicle,
  getUserVehicles
} = require('../controllers/vehicles.controller');

// User routes
router.get('/', auth, getAllVehicles);
router.get('/:id', auth, getVehicleById);
router.post('/', auth, createVehicle);
router.put('/:id', auth, updateVehicle);
router.delete('/:id', auth, deleteVehicle);
router.get('/user/:userId', auth, getUserVehicles);

module.exports = router;