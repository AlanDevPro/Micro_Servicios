const express = require('express');
const router = express.Router();
const {
  createProfile,
  getProfile,
  updateProfile,
  getAllUsers,
  deleteUser,
  updateBalance,
  getUserStats,
  verifyKYC,
  suspendUser,
  updateVIPLevel,
  getDashboardStats
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { authorize, authorizeOwnerOrAdmin } = require('../middleware/roleMiddleware');

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Gestión de perfiles de usuarios del sistema de apuestas
 */

// Rutas protegidas - requieren autenticación
router.post('/profile', protect, createProfile);
router.get('/profile/:userId', protect, authorizeOwnerOrAdmin, getProfile);
router.put('/profile/:userId', protect, authorizeOwnerOrAdmin, updateProfile);
router.get('/stats/:userId', protect, authorizeOwnerOrAdmin, getUserStats);

// Rutas de administrador
router.get('/', protect, authorize('admin'), getAllUsers);
router.delete('/profile/:userId', protect, authorize('admin'), deleteUser);
router.put('/balance/:userId', protect, authorize('admin'), updateBalance);
router.put('/verify-kyc/:userId', protect, authorize('admin'), verifyKYC);
router.put('/suspend/:userId', protect, authorize('admin'), suspendUser);
router.put('/vip/:userId', protect, authorize('admin'), updateVIPLevel);
router.get('/dashboard-stats', protect, authorize('admin'), getDashboardStats);

module.exports = router;