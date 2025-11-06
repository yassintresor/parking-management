const router = require('express').Router();
const { auth, checkRole } = require('../middlewares/auth.middleware');
const { 
  getOccupancyReport, 
  getRevenueReport, 
  getUsageReport,
  getDailyReport,
  getMonthlyReport
} = require('../controllers/analytics.controller');

// Admin/Operator routes
router.get('/occupancy', auth, checkRole(['ADMIN', 'OPERATOR']), getOccupancyReport);
router.get('/revenue', auth, checkRole(['ADMIN', 'OPERATOR']), getRevenueReport);
router.get('/usage', auth, checkRole(['ADMIN', 'OPERATOR']), getUsageReport);
router.get('/daily', auth, checkRole(['ADMIN', 'OPERATOR']), getDailyReport);
router.get('/monthly', auth, checkRole(['ADMIN', 'OPERATOR']), getMonthlyReport);

module.exports = router;