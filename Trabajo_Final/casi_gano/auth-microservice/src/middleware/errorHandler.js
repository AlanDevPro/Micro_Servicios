const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log para desarrollo
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', err);
  }

  // Error de validación de Mongoose
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error.message = message.join(', ');
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  // Error de duplicado de Mongoose
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    error.message = `El ${field} ya existe`;
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  // Error de CastError de Mongoose (ID inválido)
  if (err.name === 'CastError') {
    error.message = 'ID de recurso inválido';
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  // Error de JWT
  if (err.name === 'JsonWebTokenError') {
    error.message = 'Token inválido';
    return res.status(401).json({
      success: false,
      message: error.message
    });
  }

  // Error de JWT expirado
  if (err.name === 'TokenExpiredError') {
    error.message = 'Token expirado';
    return res.status(401).json({
      success: false,
      message: error.message
    });
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Error interno del servidor'
  });
};

module.exports = errorHandler;