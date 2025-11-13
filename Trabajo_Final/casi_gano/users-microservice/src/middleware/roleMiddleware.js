// Middleware para verificar roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado - Usuario no autenticado'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Acceso denegado - Se requiere rol: ${roles.join(' o ')}`
      });
    }

    next();
  };
};

// Middleware para verificar si el usuario puede acceder a su propio recurso
exports.authorizeOwnerOrAdmin = (req, res, next) => {
  const userId = req.params.userId || req.body.userId;

  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'No autorizado'
    });
  }

  // Admins pueden acceder a todo
  if (req.user.role === 'admin') {
    return next();
  }

  // Usuarios solo pueden acceder a sus propios recursos
  if (req.user.id !== userId) {
    return res.status(403).json({
      success: false,
      message: 'No tienes permiso para acceder a este recurso'
    });
  }

  next();
};