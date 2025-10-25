/**
 * Middleware para manejar errores de autenticación OAuth
 * Convierte errores de Passport a flash messages
 */

/**
 * Middleware para manejar errores de Passport
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
export const handlePassportError = (req, res, next) => {
  // Verificar si hay mensajes de error de Passport
  if (req.session.messages && req.session.messages.length > 0) {
    const errorMessage = req.session.messages[0];
    req.flash('error', errorMessage);
    req.session.messages = []; // Limpiar mensajes después de usar
  }
  
  // Verificar si hay errores en query parameters
  if (req.query.error) {
    const errorMessages = {
      'access_denied': 'Acceso denegado por el usuario',
      'invalid_request': 'Solicitud inválida',
      'unauthorized_client': 'Cliente no autorizado',
      'unsupported_response_type': 'Tipo de respuesta no soportado',
      'invalid_scope': 'Alcance inválido',
      'server_error': 'Error del servidor',
      'temporarily_unavailable': 'Servicio temporalmente no disponible'
    };
    
    const message = errorMessages[req.query.error] || 'Error desconocido';
    req.flash('error', message);
  }
  
  next();
};

/**
 * Middleware para manejar errores específicos de GitHub OAuth
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
export const handleGitHubError = (req, res, next) => {
  // Verificar errores específicos de GitHub
  if (req.query.error_description) {
    const errorDescription = decodeURIComponent(req.query.error_description);
    req.flash('error', errorDescription);
  }
  
  next();
};

/**
 * Middleware para logging de errores OAuth
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
export const logOAuthError = (req, res, next) => {
  if (req.query.error) {
    console.error('OAuth Error:', {
      error: req.query.error,
      error_description: req.query.error_description,
      error_uri: req.query.error_uri,
      timestamp: new Date().toISOString(),
      userAgent: req.get('User-Agent'),
      ip: req.ip
    });
  }
  
  next();
};
