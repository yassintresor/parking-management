const router = require('express').Router();
const { auth, checkRole } = require('../middlewares/auth.middleware');
const { 
  getOccupancyReport, 
  getRevenueReport, 
  getUsageReport,
  getDailyReport,
  getMonthlyReport
} = require('../controllers/analytics.controller');

/**
 * @swagger
 * /analytics/occupancy:
 *   get:
 *     summary: Get occupancy report (Admin/Operator only)
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Occupancy report
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.get('/occupancy', auth, checkRole(['ADMIN', 'OPERATOR']), getOccupancyReport);

/**
 * @swagger
 * /analytics/revenue:
 *   get:
 *     summary: Get revenue report (Admin/Operator only)
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Revenue report
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.get('/revenue', auth, checkRole(['ADMIN', 'OPERATOR']), getRevenueReport);

/**
 * @swagger
 * /analytics/usage:
 *   get:
 *     summary: Get usage report (Admin/Operator only)
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usage report
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.get('/usage', auth, checkRole(['ADMIN', 'OPERATOR']), getUsageReport);

/**
 * @swagger
 * /analytics/daily:
 *   get:
 *     summary: Get daily report (Admin/Operator only)
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daily report
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.get('/daily', auth, checkRole(['ADMIN', 'OPERATOR']), getDailyReport);

/**
 * @swagger
 * /analytics/monthly:
 *   get:
 *     summary: Get monthly report (Admin/Operator only)
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Monthly report
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.get('/monthly', auth, checkRole(['ADMIN', 'OPERATOR']), getMonthlyReport);

module.exports = router;