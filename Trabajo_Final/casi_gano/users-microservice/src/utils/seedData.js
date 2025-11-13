require('dotenv').config();
const mongoose = require('mongoose');
const UserProfile = require('../models/UserProfile');
const connectDB = require('../config/database');

// Datos realistas para usuarios de sistema de apuestas deportivas
const seedUsers = [
  // Usuario Admin
  {
    userId: 'admin-001',
    email: 'admin@sportsbet.com',
    name: 'Administrador Sistema',
    role: 'admin',
    phoneNumber: '+591-70123456',
    country: 'Bolivia',
    dateOfBirth: new Date('1985-03-15'),
    balance: 50000,
    currency: 'BOB',
    totalBets: 250,
    totalWins: 145,
    totalLosses: 105,
    totalAmountWagered: 125000,
    totalAmountWon: 156000,
    winRate: 58,
    favoritesSports: ['Fútbol', 'Baloncesto', 'Tenis'],
    favoriteLeagues: ['La Liga', 'Premier League', 'NBA'],
    kycVerified: true,
    kycVerificationDate: new Date('2023-01-10'),
    accountStatus: 'active',
    notificationsEnabled: true,
    emailNotifications: true,
    smsNotifications: true,
    vipLevel: 'Diamond',
    loyaltyPoints: 15000,
    dailyBettingLimit: 10000,
    weeklyBettingLimit: 50000,
    monthlyBettingLimit: 200000,
    lastLogin: new Date(),
    lastBetDate: new Date()
  },
  // Usuario Regular 1 - Activo y verificado
  {
    userId: 'user-001',
    email: 'carlos.mendoza@gmail.com',
    name: 'Carlos Mendoza',
    role: 'user',
    phoneNumber: '+591-71234567',
    country: 'Bolivia',
    dateOfBirth: new Date('1992-07-22'),
    address: {
      street: 'Av. 6 de Agosto 2050',
      city: 'La Paz',
      state: 'La Paz',
      zipCode: '00000'
    },
    balance: 2450.50,
    currency: 'BOB',
    totalBets: 89,
    totalWins: 45,
    totalLosses: 44,
    totalAmountWagered: 15600,
    totalAmountWon: 18200,
    winRate: 50.56,
    favoritesSports: ['Fútbol', 'Baloncesto'],
    favoriteLeagues: ['Bolivar', 'The Strongest', 'Copa Libertadores', 'NBA'],
    kycVerified: true,
    kycVerificationDate: new Date('2024-01-15'),
    accountStatus: 'active',
    notificationsEnabled: true,
    emailNotifications: true,
    smsNotifications: false,
    vipLevel: 'Gold',
    loyaltyPoints: 3500,
    dailyBettingLimit: 2000,
    weeklyBettingLimit: 10000,
    monthlyBettingLimit: 40000,
    lastLogin: new Date(),
    lastBetDate: new Date('2024-11-12')
  },
  // Usuario Regular 2 - Nuevo usuario
  {
    userId: 'user-002',
    email: 'maria.garcia@hotmail.com',
    name: 'María García',
    role: 'user',
    phoneNumber: '+591-72345678',
    country: 'Bolivia',
    dateOfBirth: new Date('1995-11-08'),
    address: {
      street: 'Calle Comercio 1523',
      city: 'Cochabamba',
      state: 'Cochabamba',
      zipCode: '00000'
    },
    balance: 500,
    currency: 'BOB',
    totalBets: 12,
    totalWins: 5,
    totalLosses: 7,
    totalAmountWagered: 1200,
    totalAmountWon: 980,
    winRate: 41.67,
    favoritesSports: ['Tenis', 'Voleibol'],
    favoriteLeagues: ['ATP Tour', 'WTA Tour'],
    kycVerified: true,
    kycVerificationDate: new Date('2024-10-20'),
    accountStatus: 'active',
    notificationsEnabled: true,
    emailNotifications: true,
    smsNotifications: true,
    vipLevel: 'Bronze',
    loyaltyPoints: 450,
    dailyBettingLimit: 500,
    weeklyBettingLimit: 3000,
    monthlyBettingLimit: 10000,
    lastLogin: new Date('2024-11-10'),
    lastBetDate: new Date('2024-11-09')
  },
  // Usuario Regular 3 - Usuario VIP
  {
    userId: 'user-003',
    email: 'roberto.silva@yahoo.com',
    name: 'Roberto Silva',
    role: 'user',
    phoneNumber: '+591-73456789',
    country: 'Bolivia',
    dateOfBirth: new Date('1988-04-17'),
    address: {
      street: 'Av. Banzer Km 7',
      city: 'Santa Cruz',
      state: 'Santa Cruz',
      zipCode: '00000'
    },
    balance: 8750.75,
    currency: 'BOB',
    totalBets: 234,
    totalWins: 142,
    totalLosses: 92,
    totalAmountWagered: 67800,
    totalAmountWon: 82300,
    winRate: 60.68,
    favoritesSports: ['Fútbol', 'Fútbol Americano', 'Béisbol'],
    favoriteLeagues: ['Premier League', 'NFL', 'MLB', 'Champions League'],
    kycVerified: true,
    kycVerificationDate: new Date('2023-05-12'),
    accountStatus: 'active',
    notificationsEnabled: true,
    emailNotifications: true,
    smsNotifications: true,
    vipLevel: 'Platinum',
    loyaltyPoints: 8900,
    dailyBettingLimit: 5000,
    weeklyBettingLimit: 30000,
    monthlyBettingLimit: 120000,
    activeBonus: {
      bonusType: 'Deposit Match',
      bonusAmount: 1000,
      expiryDate: new Date('2024-12-31'),
      wageringRequirement: 5000
    },
    lastLogin: new Date(),
    lastBetDate: new Date()
  },
  // Usuario Regular 4 - Pendiente de verificación
  {
    userId: 'user-004',
    email: 'ana.lopez@gmail.com',
    name: 'Ana López',
    role: 'user',
    phoneNumber: '+591-74567890',
    country: 'Bolivia',
    dateOfBirth: new Date('1998-09-30'),
    balance: 100,
    currency: 'BOB',
    totalBets: 0,
    totalWins: 0,
    totalLosses: 0,
    totalAmountWagered: 0,
    totalAmountWon: 0,
    winRate: 0,
    favoritesSports: ['Fútbol'],
    favoriteLeagues: [],
    kycVerified: false,
    accountStatus: 'pending_verification',
    notificationsEnabled: true,
    emailNotifications: true,
    smsNotifications: false,
    vipLevel: 'Bronze',
    loyaltyPoints: 0,
    dailyBettingLimit: 500,
    weeklyBettingLimit: 3000,
    monthlyBettingLimit: 10000,
    lastLogin: new Date('2024-11-11')
  },
  // Usuario Regular 5 - Apostador de Basketball
  {
    userId: 'user-005',
    email: 'pedro.ramirez@outlook.com',
    name: 'Pedro Ramírez',
    role: 'user',
    phoneNumber: '+591-75678901',
    country: 'Bolivia',
    dateOfBirth: new Date('1990-12-05'),
    address: {
      street: 'Calle Junín 890',
      city: 'Sucre',
      state: 'Chuquisaca',
      zipCode: '00000'
    },
    balance: 3200,
    currency: 'BOB',
    totalBets: 156,
    totalWins: 78,
    totalLosses: 78,
    totalAmountWagered: 28900,
    totalAmountWon: 31500,
    winRate: 50,
    favoritesSports: ['Baloncesto', 'Tenis'],
    favoriteLeagues: ['NBA', 'EuroLeague', 'ATP Tour'],
    kycVerified: true,
    kycVerificationDate: new Date('2024-02-28'),
    accountStatus: 'active',
    notificationsEnabled: true,
    emailNotifications: true,
    smsNotifications: true,
    vipLevel: 'Silver',
    loyaltyPoints: 4200,
    dailyBettingLimit: 2000,
    weeklyBettingLimit: 12000,
    monthlyBettingLimit: 50000,
    lastLogin: new Date('2024-11-12'),
    lastBetDate: new Date('2024-11-11')
  },
  // Usuario Suspendido
  {
    userId: 'user-006',
    email: 'juan.torres@gmail.com',
    name: 'Juan Torres',
    role: 'user',
    phoneNumber: '+591-76789012',
    country: 'Bolivia',
    dateOfBirth: new Date('1987-06-14'),
    balance: 0,
    currency: 'BOB',
    totalBets: 45,
    totalWins: 12,
    totalLosses: 33,
    totalAmountWagered: 8900,
    totalAmountWon: 3200,
    winRate: 26.67,
    favoritesSports: ['Fútbol'],
    favoriteLeagues: ['Premier League'],
    kycVerified: true,
    kycVerificationDate: new Date('2024-03-10'),
    accountStatus: 'suspended',
    suspensionReason: 'Actividad sospechosa detectada - Bajo investigación',
    notificationsEnabled: true,
    emailNotifications: true,
    smsNotifications: false,
    vipLevel: 'Bronze',
    loyaltyPoints: 890,
    dailyBettingLimit: 500,
    weeklyBettingLimit: 3000,
    monthlyBettingLimit: 10000,
    lastLogin: new Date('2024-10-15'),
    lastBetDate: new Date('2024-10-15')
  },
  // Usuario con auto-exclusión
  {
    userId: 'user-007',
    email: 'lucia.fernandez@gmail.com',
    name: 'Lucía Fernández',
    role: 'user',
    phoneNumber: '+591-77890123',
    country: 'Bolivia',
    dateOfBirth: new Date('1993-02-20'),
    balance: 150,
    currency: 'BOB',
    totalBets: 67,
    totalWins: 25,
    totalLosses: 42,
    totalAmountWagered: 12400,
    totalAmountWon: 9800,
    winRate: 37.31,
    favoritesSports: ['Fútbol', 'Tenis'],
    favoriteLeagues: ['La Liga', 'Serie A'],
    kycVerified: true,
    kycVerificationDate: new Date('2024-04-05'),
    accountStatus: 'active',
    notificationsEnabled: true,
    emailNotifications: true,
    smsNotifications: false,
    vipLevel: 'Bronze',
    loyaltyPoints: 1200,
    dailyBettingLimit: 200,
    weeklyBettingLimit: 1000,
    monthlyBettingLimit: 4000,
    selfExclusionUntil: new Date('2024-12-31'),
    lastLogin: new Date('2024-11-05'),
    lastBetDate: new Date('2024-08-20')
  }
];

// Función para poblar la base de datos
const seedDatabase = async () => {
  try {
    // Conectar a la base de datos
    await connectDB();

    // Limpiar colección existente
    console.log('🗑️  Limpiando base de datos...');
    await UserProfile.deleteMany({});

    // Insertar datos de prueba
    console.log('📝 Insertando usuarios de prueba...');
    await UserProfile.insertMany(seedUsers);

    console.log('✅ Base de datos poblada exitosamente!');
    console.log(`📊 Total de usuarios creados: ${seedUsers.length}`);
    console.log('\n👥 Usuarios creados:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    seedUsers.forEach(user => {
      console.log(`  • ${user.name} (${user.role})`);
      console.log(`    Email: ${user.email}`);
      console.log(`    Saldo: ${user.balance} ${user.currency}`);
      console.log(`    Estado: ${user.accountStatus}`);
      console.log(`    VIP: ${user.vipLevel}`);
      console.log('');
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error al poblar la base de datos:', error);
    process.exit(1);
  }
};

// Ejecutar si se llama directamente
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedUsers, seedDatabase };