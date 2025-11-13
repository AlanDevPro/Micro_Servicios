const jwt = require('jsonwebtoken');

// Middleware para proteger rutas
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Obtener token del header Authorization
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Verificar si existe token
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado - Token no proporcionado'
      });
    }

    // Verificar token (debe usar la misma clave que el microservicio de auth)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Agregar información del usuario decodificada a la request
    req.user = {
      id: decoded.id,
      role: decoded.role || 'user'
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'No autorizado - Token inválido o expirado'
    });
  }
};

// Middleware para verificar si el usuario está autenticado (opcional)
exports.optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
          id: decoded.id,
          role: decoded.role || 'user'
        };
      }
    }

    next();
  } catch (error) {
    // Si el token es inválido, continúa sin usuario autenticado
    next();
  }
};