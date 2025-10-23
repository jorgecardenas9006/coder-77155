/**
 * Archivo índice para exportar todos los middlewares
 * Facilita la importación desde otros archivos
 */

// Middlewares de autenticación
export { 
    isAuthenticated, 
    isAdmin, 
    isModerator, 
    isAuthenticatedView,
    optionalAuth 
} from './auth.middleware.js';

// Middlewares de validación
export {
    validateLoginData,
    validateRegisterData,
    validateUserData,
    validateEmail,
    validatePhone
} from './validation.middleware.js';

// Middlewares de manejo de errores
export {
    errorHandler,
    notFound,
    requestLogger,
    asyncHandler
} from './error.middleware.js';
