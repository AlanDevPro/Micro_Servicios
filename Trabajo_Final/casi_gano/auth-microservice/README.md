# 🔐 Microservicio de Autenticación

Microservicio completo de autenticación con Node.js, Express, MongoDB y JWT.

## 📋 Características

- ✅ Registro y login de usuarios
- ✅ Autenticación con JWT (Access & Refresh Tokens)
- ✅ CRUD completo de usuarios
- ✅ Roles de usuario (user, admin)
- ✅ Documentación Swagger/OpenAPI
- ✅ Seguridad con Helmet y Rate Limiting
- ✅ Dockerizado con Docker Compose
- ✅ Proxy reverso con NGINX
- ✅ Tests unitarios con Jest

## 🚀 Instalación y Ejecución

### Opción 1: Con Docker (Recomendado)

```bash
# 1. Clonar el repositorio o crear la estructura de carpetas

# 2. Construir y levantar los servicios
docker-compose up --build -d

# 3. Ver logs
docker-compose logs -f

# 4. Detener servicios
docker-compose down

# 5. Detener y eliminar volúmenes (limpia la BD)
docker-compose down -v
```

**URLs con Docker:**

- API: http://localhost:3001
- API con Proxy: http://localhost:8080/auth
- Swagger: http://localhost:3001/api-docs
- Swagger con Proxy: http://localhost:8080/auth/api-docs
- MongoDB: localhost:27017

### Opción 2: Localmente (sin Docker)

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# 3. Asegurarse de tener MongoDB corriendo
# MongoDB debe estar en: mongodb://localhost:27017

# 4. Iniciar en desarrollo
npm run dev

# 5. Iniciar en producción
npm start
```

## 📁 Estructura del Proyecto

```
auth-microservice/
├── src/
│   ├── config/
│   │   ├── database.js          # Configuración de MongoDB
│   │   └── swagger.js           # Configuración de Swagger
│   ├── controllers/
│   │   └── authController.js    # Lógica de autenticación
│   ├── middleware/
│   │   ├── authMiddleware.js    # Protección de rutas
│   │   └── errorHandler.js      # Manejo de errores
│   ├── models/
│   │   └── User.js              # Modelo de usuario
│   ├── routes/
│   │   └── authRoutes.js        # Rutas de la API
│   ├── utils/
│   │   └── validators.js        # Validadores Joi
│   └── app.js                   # Configuración Express
├── tests/
│   └── auth.test.js             # Tests unitarios
├── .env                         # Variables de entorno
├── .env.example                 # Ejemplo de variables
├── Dockerfile                   # Imagen Docker
├── docker-compose.yml           # Orquestación Docker
├── nginx.conf                   # Configuración NGINX
├── package.json                 # Dependencias
├── server.js                    # Punto de entrada
└── README.md                    # Documentación
```

## 🔌 Endpoints de la API

### Públicos (sin autenticación)

| Método | Endpoint             | Descripción             |
| ------ | -------------------- | ----------------------- |
| POST   | `/api/auth/register` | Registrar nuevo usuario |
| POST   | `/api/auth/login`    | Iniciar sesión          |
| POST   | `/api/auth/refresh`  | Refrescar token         |
| GET    | `/health`            | Health check            |

### Protegidos (requieren token)

| Método | Endpoint            | Descripción       |
| ------ | ------------------- | ----------------- |
| GET    | `/api/auth/profile` | Obtener perfil    |
| PUT    | `/api/auth/profile` | Actualizar perfil |
| POST   | `/api/auth/logout`  | Cerrar sesión     |

### Admin (requieren rol admin)

| Método | Endpoint              | Descripción      |
| ------ | --------------------- | ---------------- |
| GET    | `/api/auth/users`     | Listar usuarios  |
| DELETE | `/api/auth/users/:id` | Eliminar usuario |

## 📝 Ejemplos de Uso

### 1. Registrar Usuario

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "password": "password123"
  }'
```

**Respuesta:**

```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "user": {
      "_id": "60d5ec49f1b2c72b8c8e4f1a",
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "role": "user",
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Iniciar Sesión

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "password123"
  }'
```

### 3. Obtener Perfil (con token)

```bash
curl -X GET http://localhost:3001/api/auth/profile \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

### 4. Actualizar Perfil

```bash
curl -X PUT http://localhost:3001/api/auth/profile \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez Actualizado"
  }'
```

### 5. Refrescar Token

```bash
curl -X POST http://localhost:3001/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "TU_REFRESH_TOKEN_AQUI"
  }'
```

### 6. Listar Usuarios (Admin)

```bash
curl -X GET http://localhost:3001/api/auth/users \
  -H "Authorization: Bearer TOKEN_DE_ADMIN"
```

### 7. Cerrar Sesión

```bash
curl -X POST http://localhost:3001/api/auth/logout \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

## 🧪 Pruebas con Postman

### Importar Colección

Crea una colección en Postman con estos requests:

**1. Variables de Entorno:**

```
baseUrl: http://localhost:3001
proxyUrl: http://localhost:8080/auth
token: (se actualizará automáticamente)
```

**2. Configurar Test Scripts:**

Para Login y Register, agrega este script en la pestaña "Tests":

```javascript
if (pm.response.code === 200 || pm.response.code === 201) {
  var jsonData = pm.response.json();
  pm.environment.set("token", jsonData.data.token);
}
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

## 🔒 Seguridad

- ✅ Contraseñas hasheadas con bcrypt
- ✅ Tokens JWT seguros
- ✅ Helmet para headers de seguridad
- ✅ Rate limiting para prevenir ataques
- ✅ CORS configurado
- ✅ Validación de datos con Joi
- ✅ Variables de entorno para secretos

## 🐳 Comandos Docker Útiles

```bash
# Ver logs de un servicio específico
docker-compose logs -f auth-service

# Reiniciar un servicio
docker-compose restart auth-service

# Ejecutar comando dentro del contenedor
docker-compose exec auth-service sh

# Ver estado de los servicios
docker-compose ps

# Limpiar todo (contenedores, volúmenes, redes)
docker-compose down -v --remove-orphans
```

## 🔧 Variables de Entorno

```env
# Server
PORT=3001
NODE_ENV=development

# Database
MONGODB_URI=mongodb://mongo:27017/auth_db

# JWT
JWT_SECRET=tu_clave_secreta_aqui
JWT_EXPIRE=24h
JWT_REFRESH_SECRET=tu_clave_refresh_aqui
JWT_REFRESH_EXPIRE=7d

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8080
```

## 📊 Monitoreo

### Health Check

```bash
# Servicio
curl http://localhost:3001/health

# Proxy
curl http://localhost:8080/health
```

### MongoDB Shell

```bash
# Conectar a MongoDB en Docker
docker-compose exec mongo mongosh

# Comandos útiles
use auth_db
db.users.find()
db.users.countDocuments()
```

## 🚨 Troubleshooting

### Puerto ya en uso

```bash
# Cambiar puerto en .env o docker-compose.yml
# O matar el proceso:
lsof -ti:3001 | xargs kill -9
```

### MongoDB no conecta

```bash
# Verificar que MongoDB esté corriendo
docker-compose ps

# Ver logs
docker-compose logs mongo

# Reiniciar MongoDB
docker-compose restart mongo
```

### Error de permisos

```bash
# Dar permisos a los archivos
chmod +x server.js
```

## 📚 Documentación Swagger

Accede a la documentación interactiva en:

- Directo: http://localhost:3001/api-docs
- Con Proxy: http://localhost:8080/auth/api-docs

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

MIT License - ver archivo LICENSE para más detalles

## 👤 Autor

Tu Nombre - tu.email@example.com

## 🙏 Agradecimientos

- Express.js
- MongoDB
- JWT
- Swagger
- Docker
- NGINX
