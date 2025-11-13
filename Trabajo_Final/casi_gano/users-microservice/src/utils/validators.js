const Joi = require('joi');

// Validador para crear perfil
exports.createProfileSchema = Joi.object({
  userId: Joi.string().required(),
  email: Joi.string().email().required(),
  name: Joi.string().min(2).max(50).required(),
  phoneNumber: Joi.string().optional(),
  country: Joi.string().optional(),
  dateOfBirth: Joi.date().optional()
});

// Validador para actualizar perfil
exports.updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(50),
  phoneNumber: Joi.string(),
  country: Joi.string(),
  address: Joi.object({
    street: Joi.string(),
    city: Joi.string(),
    state: Joi.string(),
    zipCode: Joi.string()
  }),
  favoritesSports: Joi.array().items(Joi.string()),
  favoriteLeagues: Joi.array().items(Joi.string()),
  notificationsEnabled: Joi.boolean(),
  emailNotifications: Joi.boolean(),
  smsNotifications: Joi.boolean(),
  dailyBettingLimit: Joi.number().min(0),
  weeklyBettingLimit: Joi.number().min(0),
  monthlyBettingLimit: Joi.number().min(0)
});

// Validador para actualizar saldo
exports.updateBalanceSchema = Joi.object({
  amount: Joi.number().required(),
  operation: Joi.string().valid('add', 'subtract', 'set').required()
});