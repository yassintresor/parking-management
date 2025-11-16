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

/**
 * @swagger
 * /spaces/available:
 *   get:
 *     summary: Get available parking spaces
 *     tags: [Spaces]
 *     responses:
 *       200:
 *         description: List of available parking spaces
 *       500:
 *         description: Internal server error
 */
router.get('/available', getAvailableSpaces);

/**
 * @swagger
 * /spaces/available/count:
 *   get:
 *     summary: Get count of available parking spaces
 *     tags: [Spaces]
 *     responses:
 *       200:
 *         description: Count of available parking spaces
 *       500:
 *         description: Internal server error
 */
router.get('/available/count', getAvailableSpacesCount);

/**
 * @swagger
 * /spaces:
 *   get:
 *     summary: Get all parking spaces (Admin/Operator only)
 *     tags: [Spaces]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all parking spaces
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 *   post:
 *     summary: Create a new parking space (Admin only)
 *     tags: [Spaces]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - space_number
 *               - location
 *             properties:
 *               space_number:
 *                 type: string
 *               location:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [COMPACT, LARGE, HANDICAP, ELECTRIC]
 *               hourly_rate:
 *                 type: number
 *     responses:
 *       201:
 *         description: Parking space created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.get('/', auth, checkRole(['ADMIN', 'OPERATOR']), getAllSpaces);
router.post('/', auth, checkRole(['ADMIN']), createSpace);

/**
 * @swagger
 * /spaces/{id}:
 *   get:
 *     summary: Get parking space by ID
 *     tags: [Spaces]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Parking space details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Space not found
 *       500:
 *         description: Internal server error
 *   put:
 *     summary: Update parking space (Admin only)
 *     tags: [Spaces]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               space_number:
 *                 type: string
 *               location:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [COMPACT, LARGE, HANDICAP, ELECTRIC]
 *               status:
 *                 type: string
 *                 enum: [AVAILABLE, RESERVED, OCCUPIED, OUT_OF_SERVICE]
 *               hourly_rate:
 *                 type: number
 *     responses:
 *       200:
 *         description: Parking space updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Space not found
 *       500:
 *         description: Internal server error
 *   delete:
 *     summary: Delete parking space (Admin only)
 *     tags: [Spaces]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Parking space deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Space not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', auth, getSpaceById);
router.put('/:id', auth, checkRole(['ADMIN']), updateSpace);
router.delete('/:id', auth, checkRole(['ADMIN']), deleteSpace);

/**
 * @swagger
 * /spaces/{id}/status:
 *   put:
 *     summary: Update parking space status (Admin/Operator only)
 *     tags: [Spaces]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [AVAILABLE, RESERVED, OCCUPIED, OUT_OF_SERVICE]
 *     responses:
 *       200:
 *         description: Parking space status updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Space not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id/status', auth, checkRole(['ADMIN', 'OPERATOR']), updateSpaceStatus);

module.exports = router;