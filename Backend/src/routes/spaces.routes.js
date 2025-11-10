const router = require('express').Router();
const { auth, checkRole } = require('../middlewares/auth.middleware');
const { 
  getAllSpaces, 
  getSpaceById, 
  createSpace, 
  updateSpace, 
  deleteSpace,
  getAvailableSpaces,
  updateSpaceStatus,
  getAvailableSpacesCount
} = require('../controllers/spaces.controller');

// Public routes
router.get('/available', getAvailableSpaces);
router.get('/available/count', getAvailableSpacesCount);

// Admin routes
router.get('/', auth, checkRole(['ADMIN', 'OPERATOR']), getAllSpaces);
router.post('/', auth, checkRole(['ADMIN']), createSpace);
router.get('/:id', auth, getSpaceById);
router.put('/:id', auth, checkRole(['ADMIN']), updateSpace);
router.delete('/:id', auth, checkRole(['ADMIN']), deleteSpace);
router.put('/:id/status', auth, checkRole(['ADMIN', 'OPERATOR']), updateSpaceStatus);

module.exports = router;