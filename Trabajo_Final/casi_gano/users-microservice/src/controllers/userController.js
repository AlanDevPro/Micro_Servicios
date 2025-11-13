const UserProfile = require('../models/UserProfile');
const axios = require('axios');

/**
 * @swagger
 * /api/users/profile:
 *   post:
 *     summary: Crear perfil de usuario (automático después de registro)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - email
 *               - name
 *             properties:
 *               userId:
 *                 type: string
 *               email:
 *                 type: string
 *               name:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               country:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Perfil creado exitosamente
 */
exports.createProfile = async (req, res, next) => {
  try {
    const { userId, email, name, phoneNumber, country, dateOfBirth } = req.body;

    // Verificar si ya existe el perfil
    const existingProfile = await UserProfile.findOne({ userId });
    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: 'El perfil de usuario ya existe'
      });
    }

    // Crear perfil
    const profile = await UserProfile.create({
      userId,
      email,
      name,
      phoneNumber,
      country,
      dateOfBirth,
      role: req.user?.role || 'user',
      balance: 100, // Bono de bienvenida
      accountStatus: 'pending_verification'
    });

    res.status(201).json({
      success: true,
      message: 'Perfil creado exitosamente. Bono de bienvenida: $100',
      data: profile.toPublicJSON()
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/users/profile/{userId}:
 *   get:
 *     summary: Obtener perfil de usuario por ID
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Perfil obtenido exitosamente
 */
exports.getProfile = async (req, res, next) => {
  try {
    const profile = await UserProfile.findOne({ userId: req.params.userId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Perfil de usuario no encontrado'
      });
    }

    // Usuarios solo pueden ver su propio perfil, admins pueden ver todos
    if (req.user.role !== 'admin' && req.user.id !== req.params.userId) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para ver este perfil'
      });
    }

    res.status(200).json({
      success: true,
      data: profile.toPublicJSON()
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/users/profile/{userId}:
 *   put:
 *     summary: Actualizar perfil de usuario
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               country:
 *                 type: string
 *               favoritesSports:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Perfil actualizado exitosamente
 */
exports.updateProfile = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Verificar permisos
    if (req.user.role !== 'admin' && req.user.id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para actualizar este perfil'
      });
    }

    // Campos que el usuario puede actualizar
    const allowedUpdates = [
      'name', 'phoneNumber', 'country', 'address',
      'favoritesSports', 'favoriteLeagues', 'notificationsEnabled',
      'emailNotifications', 'smsNotifications', 'dailyBettingLimit',
      'weeklyBettingLimit', 'monthlyBettingLimit'
    ];

    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const profile = await UserProfile.findOneAndUpdate(
      { userId },
      updates,
      { new: true, runValidators: true }
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Perfil no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      data: profile.toPublicJSON()
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtener todos los usuarios (solo admin)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [user, admin]
 *       - in: query
 *         name: accountStatus
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de usuarios
 */
exports.getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Filtros opcionales
    const filters = {};
    if (req.query.role) filters.role = req.query.role;
    if (req.query.accountStatus) filters.accountStatus = req.query.accountStatus;
    if (req.query.kycVerified) filters.kycVerified = req.query.kycVerified === 'true';

    const users = await UserProfile.find(filters)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await UserProfile.countDocuments(filters);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: users.map(user => user.toPublicJSON())
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/users/profile/{userId}:
 *   delete:
 *     summary: Eliminar perfil de usuario (solo admin)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 */
exports.deleteUser = async (req, res, next) => {
  try {
    const profile = await UserProfile.findOneAndDelete({ userId: req.params.userId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Usuario eliminado exitosamente'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/users/balance/{userId}:
 *   put:
 *     summary: Actualizar saldo de usuario (admin o sistema)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               operation:
 *                 type: string
 *                 enum: [add, subtract, set]
 *     responses:
 *       200:
 *         description: Saldo actualizado exitosamente
 */
exports.updateBalance = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { amount, operation } = req.body;

    if (!amount || !operation) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere amount y operation'
      });
    }

    const profile = await UserProfile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Actualizar saldo según operación
    switch (operation) {
      case 'add':
        profile.balance += amount;
        break;
      case 'subtract':
        if (profile.balance < amount) {
          return res.status(400).json({
            success: false,
            message: 'Saldo insuficiente'
          });
        }
        profile.balance -= amount;
        break;
      case 'set':
        profile.balance = amount;
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Operación inválida'
        });
    }

    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Saldo actualizado exitosamente',
      data: {
        userId: profile.userId,
        balance: profile.balance,
        currency: profile.currency
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/users/stats/{userId}:
 *   get:
 *     summary: Obtener estadísticas de apuestas del usuario
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Estadísticas obtenidas exitosamente
 */
exports.getUserStats = async (req, res, next) => {
  try {
    const profile = await UserProfile.findOne({ userId: req.params.userId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Verificar permisos
    if (req.user.role !== 'admin' && req.user.id !== req.params.userId) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para ver estas estadísticas'
      });
    }

    // Calcular win rate
    profile.calculateWinRate();
    await profile.save();

    const stats = {
      userId: profile.userId,
      name: profile.name,
      vipLevel: profile.vipLevel,
      loyaltyPoints: profile.loyaltyPoints,
      balance: profile.balance,
      currency: profile.currency,
      totalBets: profile.totalBets,
      totalWins: profile.totalWins,
      totalLosses: profile.totalLosses,
      winRate: profile.winRate,
      totalAmountWagered: profile.totalAmountWagered,
      totalAmountWon: profile.totalAmountWon,
      profit: profile.totalAmountWon - profile.totalAmountWagered,
      favoritesSports: profile.favoritesSports,
      lastBetDate: profile.lastBetDate
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/users/verify-kyc/{userId}:
 *   put:
 *     summary: Verificar KYC de usuario (solo admin)
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               kycVerified:
 *                 type: boolean
 *               accountStatus:
 *                 type: string
 *                 enum: [active, pending_verification, suspended, banned]
 *     responses:
 *       200:
 *         description: KYC actualizado exitosamente
 */

exports.verifyKYC = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { kycVerified, accountStatus } = req.body;

    const profile = await UserProfile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Actualizar verificación KYC
    if (kycVerified !== undefined) {
      profile.kycVerified = kycVerified;
      if (kycVerified) {
        profile.kycVerificationDate = new Date();
        profile.accountStatus = 'active';
      }
    }

    if (accountStatus) {
      profile.accountStatus = accountStatus;
    }

    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Verificación KYC actualizada exitosamente',
      data: profile.toPublicJSON()
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/users/suspend/{userId}:
 *   put:
 *     summary: Suspender o banear usuario (solo admin)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               accountStatus:
 *                 type: string
 *                 enum: [suspended, banned, active]
 *               suspensionReason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Estado de cuenta actualizado
 */
exports.suspendUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { accountStatus, suspensionReason } = req.body;

    const profile = await UserProfile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    profile.accountStatus = accountStatus;
    if (suspensionReason) {
      profile.suspensionReason = suspensionReason;
    }

    await profile.save();

    res.status(200).json({
      success: true,
      message: `Usuario ${accountStatus === 'banned' ? 'baneado' : accountStatus === 'suspended' ? 'suspendido' : 'activado'} exitosamente`,
      data: profile.toPublicJSON()
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/users/vip/{userId}:
 *   put:
 *     summary: Actualizar nivel VIP del usuario (solo admin)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               vipLevel:
 *                 type: string
 *                 enum: [Bronze, Silver, Gold, Platinum, Diamond]
 *               loyaltyPoints:
 *                 type: number
 *     responses:
 *       200:
 *         description: Nivel VIP actualizado exitosamente
 */
exports.updateVIPLevel = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { vipLevel, loyaltyPoints } = req.body;

    const profile = await UserProfile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    if (vipLevel) profile.vipLevel = vipLevel;
    if (loyaltyPoints !== undefined) profile.loyaltyPoints = loyaltyPoints;

    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Nivel VIP actualizado exitosamente',
      data: {
        userId: profile.userId,
        name: profile.name,
        vipLevel: profile.vipLevel,
        loyaltyPoints: profile.loyaltyPoints
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/users/dashboard-stats:
 *   get:
 *     summary: Obtener estadísticas del dashboard (solo admin)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas generales del sistema
 */
exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await UserProfile.countDocuments();
    const activeUsers = await UserProfile.countDocuments({ accountStatus: 'active' });
    const verifiedUsers = await UserProfile.countDocuments({ kycVerified: true });
    const suspendedUsers = await UserProfile.countDocuments({ accountStatus: 'suspended' });
    const bannedUsers = await UserProfile.countDocuments({ accountStatus: 'banned' });
    
    // Estadísticas de apuestas
    const bettingStats = await UserProfile.aggregate([
      {
        $group: {
          _id: null,
          totalBets: { $sum: '$totalBets' },
          totalAmountWagered: { $sum: '$totalAmountWagered' },
          totalAmountWon: { $sum: '$totalAmountWon' },
          totalBalance: { $sum: '$balance' }
        }
      }
    ]);

    // Top usuarios por saldo
    const topUsersByBalance = await UserProfile.find()
      .sort({ balance: -1 })
      .limit(5)
      .select('userId name balance vipLevel');

    // Distribución por nivel VIP
    const vipDistribution = await UserProfile.aggregate([
      {
        $group: {
          _id: '$vipLevel',
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          active: activeUsers,
          verified: verifiedUsers,
          suspended: suspendedUsers,
          banned: bannedUsers,
          pendingVerification: totalUsers - verifiedUsers
        },
        betting: bettingStats[0] || {
          totalBets: 0,
          totalAmountWagered: 0,
          totalAmountWon: 0,
          totalBalance: 0
        },
        topUsers: topUsersByBalance,
        vipDistribution
      }
    });
  } catch (error) {
    next(error);
  }
};