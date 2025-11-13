const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  // Referencia al usuario del microservicio de autenticación
  userId: {
    type: String,
    required: [true, 'El ID de usuario es obligatorio'],
    unique: true,
    index: true
  },
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    unique: true,
    lowercase: true,
    trim: true
  },
  name: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  // Información personal
  phoneNumber: {
    type: String,
    trim: true
  },
  country: {
    type: String,
    trim: true
  },
  dateOfBirth: {
    type: Date
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  
  // Información de la cuenta de apuestas
  balance: {
    type: Number,
    default: 0,
    min: [0, 'El saldo no puede ser negativo']
  },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'BOB']
  },
  
  // Estadísticas de apuestas
  totalBets: {
    type: Number,
    default: 0
  },
  totalWins: {
    type: Number,
    default: 0
  },
  totalLosses: {
    type: Number,
    default: 0
  },
  totalAmountWagered: {
    type: Number,
    default: 0
  },
  totalAmountWon: {
    type: Number,
    default: 0
  },
  winRate: {
    type: Number,
    default: 0
  },
  
  // Preferencias
  favoritesSports: [{
    type: String,
    enum: ['Fútbol', 'Baloncesto', 'Tenis', 'Béisbol', 'Fútbol Americano', 
           'Hockey', 'Boxeo', 'MMA', 'Voleibol', 'Ciclismo']
  }],
  favoriteLeagues: [{
    type: String
  }],
  notificationsEnabled: {
    type: Boolean,
    default: true
  },
  emailNotifications: {
    type: Boolean,
    default: true
  },
  smsNotifications: {
    type: Boolean,
    default: false
  },
  
  // Verificación y seguridad
  kycVerified: {
    type: Boolean,
    default: false
  },
  kycVerificationDate: {
    type: Date
  },
  identificationDocument: {
    type: String,
    documentNumber: String,
    expiryDate: Date
  },
  
  // Estado de la cuenta
  accountStatus: {
    type: String,
    enum: ['active', 'suspended', 'banned', 'pending_verification'],
    default: 'pending_verification'
  },
  suspensionReason: {
    type: String
  },
  
  // Límites de apuestas (juego responsable)
  dailyBettingLimit: {
    type: Number,
    default: 1000
  },
  weeklyBettingLimit: {
    type: Number,
    default: 5000
  },
  monthlyBettingLimit: {
    type: Number,
    default: 20000
  },
  selfExclusionUntil: {
    type: Date
  },
  
  // Bonos y promociones
  activeBonus: {
    bonusType: String,
    bonusAmount: Number,
    expiryDate: Date,
    wageringRequirement: Number
  },
  vipLevel: {
    type: String,
    enum: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'],
    default: 'Bronze'
  },
  loyaltyPoints: {
    type: Number,
    default: 0
  },
  
  // Fechas
  lastLogin: {
    type: Date
  },
  lastBetDate: {
    type: Date
  }
}, {
  timestamps: true,
  versionKey: false
});

// Índices para mejorar el rendimiento
userProfileSchema.index({ email: 1 });
userProfileSchema.index({ accountStatus: 1 });
userProfileSchema.index({ role: 1 });
userProfileSchema.index({ kycVerified: 1 });

// Método para calcular win rate
userProfileSchema.methods.calculateWinRate = function() {
  if (this.totalBets === 0) {
    this.winRate = 0;
  } else {
    this.winRate = ((this.totalWins / this.totalBets) * 100).toFixed(2);
  }
};

// Método para verificar límites de apuestas
userProfileSchema.methods.canPlaceBet = function(amount) {
  if (this.selfExclusionUntil && new Date() < this.selfExclusionUntil) {
    return { canBet: false, reason: 'Cuenta en auto-exclusión' };
  }
  
  if (this.accountStatus !== 'active') {
    return { canBet: false, reason: 'Cuenta no activa' };
  }
  
  if (amount > this.balance) {
    return { canBet: false, reason: 'Saldo insuficiente' };
  }
  
  return { canBet: true };
};

// Método para obtener objeto público
userProfileSchema.methods.toPublicJSON = function() {
  const obj = this.toObject();
  
  // No exponer información sensible
  delete obj.identificationDocument;
  delete obj.suspensionReason;
  
  return obj;
};

module.exports = mongoose.model('UserProfile', userProfileSchema);