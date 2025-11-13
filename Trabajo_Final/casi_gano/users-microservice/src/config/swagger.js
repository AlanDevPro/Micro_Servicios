const swaggerJsdoc = require('swagger-jsdoc');


const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Usuarios - Sistema de Apuestas Deportivas',
      version: '1.0.0',
      description: 'Microservicio de gestión de perfiles de usuarios para plataforma de apuestas deportivas',
      contact: {
        name: 'Equipo de Desarrollo',
        email: 'dev@sportsbet.com'
      },
    },
    servers: [
      {
        url: 'http://localhost:3002',
        description: 'Servidor de desarrollo'
      },
      {
        url: 'http://localhost:8080/users',
        description: 'Servidor con proxy reverso'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      },
      schemas: {
        UserProfile: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'ID único del perfil'
            },
            userId: {
              type: 'string',
              description: 'ID del usuario en el servicio de autenticación'
            },
            email: {
              type: 'string',
              format: 'email'
            },
            name: {
              type: 'string'
            },
            role: {
              type: 'string',
              enum: ['user', 'admin']
            },
            phoneNumber: {
              type: 'string'
            },
            country: {
              type: 'string'
            },
            dateOfBirth: {
              type: 'string',
              format: 'date'
            },
            balance: {
              type: 'number',
              description: 'Saldo disponible en la cuenta'
            },
            totalBets: {
              type: 'number',
              description: 'Total de apuestas realizadas'
            },
            totalWins: {
              type: 'number',
              description: 'Total de apuestas ganadas'
            },
            totalLosses: {
              type: 'number',
              description: 'Total de apuestas perdidas'
            },
            favoritesSports: {
              type: 'array',
              items: {
                type: 'string'
              }
            },
            kycVerified: {
              type: 'boolean',
              description: 'Verificación KYC completada'
            },
            accountStatus: {
              type: 'string',
              enum: ['active', 'suspended', 'banned', 'pending_verification']
            }
          }
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js']
};

module.exports = swaggerJsdoc(options);