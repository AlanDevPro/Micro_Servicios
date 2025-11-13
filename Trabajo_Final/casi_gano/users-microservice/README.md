# 🎮 Microservicio de Usuarios - Sistema de Apuestas Deportivas

Microservicio completo de gestión de usuarios para plataforma de apuestas deportivas con Node.js, Express, MongoDB y JWT.

## 📋 Características

- ✅ Gestión completa de perfiles de usuario
- ✅ Integración con microservicio de autenticación
- ✅ Sistema de roles (user, admin)
- ✅ Gestión de saldos y transacciones
- ✅ Estadísticas detalladas de apuestas
- ✅ Sistema de niveles VIP (Bronze, Silver, Gold, Platinum, Diamond)
- ✅ Verificación KYC
- ✅ Límites de apuestas y juego responsable
- ✅ Bonos y promociones
- ✅ Deportes y ligas favoritas
- ✅ Documentación Swagger/OpenAPI
- ✅ Dockerizado con Docker Compose
- ✅ Proxy reverso con NGINX
- ✅ Tests unitarios con Jest

## 🏗️ Arquitectura

Este microservicio funciona en conjunto con el microservicio de autenticación:

```
┌─────────────────────┐         ┌─────────────────────┐
│  Auth Microservice  │◄────────┤  Users Microservice │
│   (Puerto 3001)     │  JWT    │   (Puerto 3002)     │
│   MongoDB (27017)   │ Verify  │   MongoDB (27018)   │
└─────────────────────┘         └─────────────────────┘
         │                               │
         └───────────┬───────────────────┘
                     │
              ┌──────▼──────┐
              │    NGINX    │
              │ (Puerto 8080/8081) │
              └─────────────┘
```

## 🚀 Instalación y Ejecución

### Opción 1: Con Docker (Recomendado)

```bash
# 1. Clonar o crear la estructura

# 2. Construir y levantar los servicios
docker-compose up --build -d

# 3. Poblar la base de datos con usuarios de prueba
docker-compose exec users-service npm run seed

# 4. Ver logs
docker-compose logs -f users-service

# 5. Detener servicios
docker-compose down
```

**URLs con Docker:**

- API: http://localhost:3002
- API con Proxy: http://localhost:8081/users
- Swagger: http://localhost:3002/api-docs
- Swagger con Proxy: http://localhost:8081/users/api-docs
- MongoDB: localhost:27018

### Opción 2: Localmente (sin Docker)

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# 3. Asegurarse de tener MongoDB corriendo en puerto 27018

# 4. Poblar base de datos
npm run seed

# 5. Iniciar en desarrollo
npm run dev

# 6. Iniciar en producción
npm start
```

## 📁 Estructura del Proyecto

```
users-microservice/
├── src/
│   ├── config/
│   │   ├── database.js          # Configuración de MongoDB
│   │   └── swagger.js           # Configuración de Swagger
│   ├── controllers/
│   │   └── userController.js    # Lógica de negocio
│   ├── middleware/
│   │   ├── authMiddleware.js    # Verificación JWT
│   │   ├── roleMiddleware.js    # Control de roles
│   │   └── errorHandler.js      # Manejo de errores
│   ├── models/
│   │   └── UserProfile.js       # Modelo de usuario
│   ├── routes/
│   │   └── userRoutes.js        # Rutas de la API
│   ├── utils/
│   │   ├── validators.js        # Validadores Joi
│   │   └── seedData.js          # Datos de prueba
│   └── app.js                   # Configuración Express
├── tests/
│   └── user.test.js             # Tests unitarios
├── .env                         # Variables de entorno
├── Dockerfile                   # Imagen Docker
├── docker-compose.yml           # Orquestación Docker
├── nginx.conf                   # Configuración NGINX
├── package.json                 # Dependencias
├── server.js                    # Punto de entrada
└── README.md                    # Documentación
```

## 🔌 Endpoints de la API

### Gestión de Perfiles

| Método | Endpoint                     | Descripción              | Autenticación     |
| ------ | ---------------------------- | ------------------------ | ----------------- |
| POST   | `/api/users/profile`         | Crear perfil de usuario  | JWT               |
| GET    | `/api/users/profile/:userId` | Obtener perfil           | JWT + Owner/Admin |
| PUT    | `/api/users/profile/:userId` | Actualizar perfil        | JWT + Owner/Admin |
| GET    | `/api/users/stats/:userId`   | Estadísticas del usuario | JWT + Owner/Admin |

### Administración (Solo Admin)

| Método | Endpoint                        | Descripción                |
| ------ | ------------------------------- | -------------------------- |
| GET    | `/api/users`                    | Listar todos los usuarios  |
| DELETE | `/api/users/profile/:userId`    | Eliminar usuario           |
| PUT    | `/api/users/balance/:userId`    | Actualizar saldo           |
| PUT    | `/api/users/verify-kyc/:userId` | Verificar KYC              |
| PUT    | `/api/users/suspend/:userId`    | Suspender/Banear usuario   |
| PUT    | `/api/users/vip/:userId`        | Actualizar nivel VIP       |
| GET    | `/api/users/dashboard-stats`    | Estadísticas del dashboard |

### Health Check

| Método | Endpoint  | Descripción         |
| ------ | --------- | ------------------- |
| GET    | `/health` | Estado del servicio |

## 📝 Ejemplos de Uso

### 1. Crear Perfil de Usuario

```bash
curl -X POST http://localhost:3002/api/users/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_JWT" \
  -d '{
    "userId": "user-123",
    "email": "usuario@example.com",
    "name": "Juan Pérez",
    "phoneNumber": "+591-70123456",
    "country": "Bolivia",
    "dateOfBirth": "1990-05-15"
  }'
```

**Respuesta:**

```json
{
  "success": true,
  "message": "Perfil creado exitosamente. Bono de bienvenida: $100",
  "data": {
    "_id": "...",
    "userId": "user-123",
    "email": "usuario@example.com",
    "name": "Juan Pérez",
    "balance": 100,
    "currency": "BOB",
    "accountStatus": "pending_verification",
    "vipLevel": "Bronze",
    "totalBets": 0,
    "winRate": 0
  }
}
```

### 2. Obtener Perfil de Usuario

```bash
curl -X GET http://localhost:3002/api/users/profile/user-123 \
  -H "Authorization: Bearer TU_TOKEN_JWT"
```

### 3. Actualizar Perfil

```bash
curl -X PUT http://localhost:3002/api/users/profile/user-123 \
  -H "Authorization: Bearer TU_TOKEN_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "favoritesSports": ["Fútbol", "Baloncesto"],
    "dailyBettingLimit": 1000
  }'
```

### 4. Obtener Estadísticas

```bash
curl -X GET http://localhost:3002/api/users/stats/user-123 \
  -H "Authorization: Bearer TU_TOKEN_JWT"
```

### 5. Listar Usuarios (Admin)

```bash
curl -X GET "http://localhost:3002/api/users?page=1&limit=10&role=user" \
  -H "Authorization: Bearer TOKEN_ADMIN"
```

### 6. Actualizar Saldo (Admin)

```bash
curl -X PUT http://localhost:3002/api/users/balance/user-123 \
  -H "Authorization: Bearer TOKEN_ADMIN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 500,
    "operation": "add"
  }'
```

### 7. Verificar KYC (Admin)

```bash
curl -X PUT http://localhost:3002/api/users/verify-kyc/user-123 \
  -H "Authorization: Bearer TOKEN_ADMIN" \
  -H "Content-Type: application/json" \
  -d '{
    "kycVerified": true,
    "accountStatus": "active"
  }'
```

### 8. Actualizar Nivel VIP (Admin)

```bash
curl -X PUT http://localhost:3002/api/users/vip/user-123 \
  -H "Authorization: Bearer TOKEN_ADMIN" \
  -H "Content-Type: application/json" \
  -d '{
    "vipLevel": "Gold",
    "loyaltyPoints": 5000
  }'
```

### 9. Obtener Estadísticas del Dashboard (Admin)

```bash
curl -X GET http://localhost:3002/api/users/dashboard-stats \
  -H "Authorization: Bearer TOKEN_ADMIN"
```

## 🧪 Poblar Base de Datos con Datos de Prueba

El microservicio incluye 8 usuarios de prueba realistas:

```bash
# Con Docker
docker-compose exec users-service npm run seed

# Sin Docker
npm run seed
```

**Usuarios creados:**

1. **Admin Sistema** (admin@sportsbet.com)

   - Role: admin
   - Saldo: 50,000 BOB
   - VIP: Diamond
   - Win Rate: 58%

2. **Carlos Mendoza** (carlos.mendoza@gmail.com)

   - Role: user
   - Saldo: 2,450 BOB
   - VIP: Gold
   - Verificado KYC

3. **María García** (maria.garcia@hotmail.com)

   - Role: user
   - Usuario nuevo
   - VIP: Bronze

4. **Roberto Silva** (roberto.silva@yahoo.com)

   - Role: user
   - Saldo: 8,750 BOB
   - VIP: Platinum
   - Tiene bono activo

5. **Ana López** (ana.lopez@gmail.com)

   - Pendiente de verificación KYC

6. **Pedro Ramírez** (pedro.ramirez@outlook.com)

   - Apostador de Basketball
   - VIP: Silver

7. **Juan Torres** (juan.torres@gmail.com)

   - Cuenta suspendida

8. **Lucía Fernández** (lucia.fernandez@gmail.com)
   - En auto-exclusión

## 🔐 Integración con Microservicio de Autenticación

Este microservicio verifica tokens JWT generados por el microservicio de autenticación:

1. El usuario se registra/login en el servicio de autenticación (puerto 3001)
2. Recibe un JWT
3. Usa ese JWT para acceder a este microservicio (puerto 3002)
4. El JWT debe tener la misma clave secreta (`JWT_SECRET`) en ambos servicios

**Flujo de integración:**

```javascript
// 1. Login en Auth Service
POST http://localhost:3001/api/auth/login
Body: { "email": "user@example.com", "password": "password123" }
Response: { "token": "eyJhbGc..." }

// 2. Crear perfil en Users Service
POST http://localhost:3002/api/users/profile
Headers: { "Authorization": "Bearer eyJhbGc..." }
Body: { "userId": "ID_DEL_TOKEN", "email": "...", "name": "..." }
```

## 🧪 Ejecutar Tests

```bash
# Ejecutar todos los tests
npm test

# Tests con coverage
npm test -- --coverage

# Tests en modo watch
npm test -- --watch
```

## 🔧 Variables de Entorno

```env
# Server
PORT=3002
NODE_ENV=development

# Database
MONGODB_URI=mongodb://mongo-users:27017/users_db

# JWT (debe coincidir con auth-service)
JWT_SECRET=tu_clave_secreta_aqui
JWT_EXPIRE=24h

# Auth Service
AUTH_SERVICE_URL=http://auth-service:3001

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8080
```

## 🐳 Docker Compose Completo (Auth + Users)

Para ejecutar ambos microservicios juntos, crea un `docker-compose.yml` global:

```yaml
version: "3.8"

services:
  # Microservicio de Autenticación
  auth-service:
    build: ./auth-microservice
    ports:
      - "3001:3001"
    environment:
      - MONGODB_URI=mongodb://mongo-auth:27017/auth_db
      - JWT_SECRET=mi_clave_secreta_compartida_2024
    depends_on:
      - mongo-auth
    networks:
      - app-network

  mongo-auth:
    image: mongo:7.0
    ports:
      - "27017:27017"
    volumes:
      - mongo-auth-data:/data/db
    networks:
      - app-network

  # Microservicio de Usuarios
  users-service:
    build: ./users-microservice
    ports:
      - "3002:3002"
    environment:
      - MONGODB_URI=mongodb://mongo-users:27017/users_db
      - JWT_SECRET=mi_clave_secreta_compartida_2024
      - AUTH_SERVICE_URL=http://auth-service:3001
    depends_on:
      - mongo-users
    networks:
      - app-network

  mongo-users:
    image: mongo:7.0
    ports:
      - "27018:27017"
    volumes:
      - mongo-users-data:/data/db
    networks:
      - app-network

  # Proxy Reverso
  nginx:
    image: nginx:alpine
    ports:
      - "8080:80"
    volumes:
      - ./nginx-global.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - auth-service
      - users-service
    networks:
      - app-network

networks:
  app-network:
    driver: bridge

volumes:
  mongo-auth-data:
  mongo-users-data:
```

### nginx-global.conf (Para ambos servicios)

```nginx
events {
    worker_connections 1024;
}

http {
    # Upstreams
    upstream auth_service {
        server auth-service:3001;
    }

    upstream users_service {
        server users-service:3002;
    }

    server {
        listen 80;

        # Auth Service
        location /auth/ {
            rewrite ^/auth/(.*) /$1 break;
            proxy_pass http://auth_service;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        # Users Service
        location /users/ {
            rewrite ^/users/(.*) /$1 break;
            proxy_pass http://users_service;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
}
```

## 📊 Modelo de Datos

### UserProfile Schema

```javascript
{
  userId: String,              // ID del servicio de auth
  email: String,               // Email único
  name: String,                // Nombre completo
  role: String,                // 'user' | 'admin'
  phoneNumber: String,
  country: String,
  dateOfBirth: Date,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  balance: Number,             // Saldo disponible
  currency: String,            // 'USD', 'EUR', 'BOB', etc.
  totalBets: Number,
  totalWins: Number,
  totalLosses: Number,
  totalAmountWagered: Number,
  totalAmountWon: Number,
  winRate: Number,
  favoritesSports: [String],
  favoriteLeagues: [String],
  kycVerified: Boolean,
  kycVerificationDate: Date,
  accountStatus: String,       // 'active' | 'suspended' | 'banned' | 'pending_verification'
  vipLevel: String,            // 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond'
  loyaltyPoints: Number,
  dailyBettingLimit: Number,
  weeklyBettingLimit: Number,
  monthlyBettingLimit: Number,
  selfExclusionUntil: Date,
  lastLogin: Date,
  lastBetDate: Date
}
```

## 🚨 Troubleshooting

### Puerto ya en uso

```bash
lsof -ti:3002 | xargs kill -9
```

### MongoDB no conecta

```bash
docker-compose ps
docker-compose logs mongo-users
docker-compose restart mongo-users
```

### Token inválido

Verificar que `JWT_SECRET` sea el mismo en auth y users microservices.

## 📚 Documentación Swagger

Accede a la documentación interactiva:

- Directo: http://localhost:3002/api-docs
- Con Proxy: http://localhost:8081/users/api-docs

## 📄 Licencia

MIT License

## 👤 Autor

Tu Nombre - tu.email@example.com

```

## 📍 **DÓNDE COPIAR CADA ARCHIVO**
```

📂 Crear carpeta principal:
users-microservice/

📄 En la raíz (users-microservice/):
├── package.json
├── server.js
├── .env
├── .env.example
├── .dockerignore
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── nginx.conf
└── README.md

📂 Crear carpeta src/:
users-microservice/src/
└── app.js

📂 Crear carpeta src/config/:
users-microservice/src/config/
├── database.js
└── swagger.js

📂 Crear carpeta src/controllers/:
users-microservice/src/controllers/
└── userController.js

📂 Crear carpeta src/middleware/:
users-microservice/src/middleware/
├── authMiddleware.js
├── roleMiddleware.js
└── errorHandler.js

📂 Crear carpeta src/models/:
users-microservice/src/models/
└── UserProfile.js

📂 Crear carpeta src/routes/:
users-microservice/src/routes/
└── userRoutes.js

📂 Crear carpeta src/utils/:
users-microservice/src/utils/
├── validators.js
└── seedData.js

📂 Crear carpeta tests/:
users-microservice/tests/
└── user.test.js
