const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getProfile,
  updateProfile,
  getAllUsers,
  deleteUser,
  refreshToken,
  logout
} = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Autenticación
 *   description: Endpoints de autenticación y gestión de usuarios
 */

// Rutas públicas
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);

// Rutas protegidas
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/logout', protect, logout);

// Rutas de administrador
router.get('/users', protect, authorize('admin'), getAllUsers);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);

module.exports = router;
