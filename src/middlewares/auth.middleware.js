/**
 * Middleware de autenticación
 * Verifica si el usuario está autenticado mediante la sesión
 */

/**
 * Verifica si el usuario está autenticado
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
export const isAuthenticated = (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).json({ 
            message: 'Unauthorized - User not authenticated',
            code: 'AUTH_REQUIRED'
        });
    }
    next();
};

/**
 * Verifica si el usuario tiene rol de administrador
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
export const isAdmin = (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).json({ 
            message: 'Unauthorized - User not authenticated',
            code: 'AUTH_REQUIRED'
        });
    }
    
    if (req.session.user.role !== 'admin') {
        return res.status(403).json({ 
            message: 'Forbidden - Admin access required',
            code: 'ADMIN_REQUIRED'
        });
    }
    next();
};

/**
 * Verifica si el usuario tiene rol de moderador o superior
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
export const isModerator = (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).json({ 
            message: 'Unauthorized - User not authenticated',
            code: 'AUTH_REQUIRED'
        });
    }
    
    const allowedRoles = ['admin', 'moderator'];
    if (!allowedRoles.includes(req.session.user.role)) {
        return res.status(403).json({ 
            message: 'Forbidden - Moderator access required',
            code: 'MODERATOR_REQUIRED'
        });
    }
    next();
};

/**
 * Middleware de autenticación para vistas
 * Muestra una página de error temporal y redirige al login si no está autenticado
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
export const isAuthenticatedView = (req, res, next) => {
    if (!req.session.user) {
        return res.render('layouts/auth-error', {
            title: 'Acceso No Autorizado',
            errorMessage: 'Debes iniciar sesión para acceder a esta página.',
            redirectUrl: '/login',
            redirectDelay: 3000
        });
    }
    next();
};

/**
 * Middleware opcional de autenticación
 * No bloquea la request si no hay usuario, pero agrega información si existe
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
export const optionalAuth = (req, res, next) => {
    // Si hay usuario en sesión, lo agregamos al request
    if (req.session.user) {
        req.user = req.session.user;
    }
    next();
};
