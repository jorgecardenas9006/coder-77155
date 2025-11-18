/**
 * Middleware de manejo de errores y respuestas HTTP
 * Maneja errores de manera centralizada y proporciona métodos para respuestas consistentes
 */

/**
 * Clase para manejar respuestas HTTP de manera consistente
 * Sigue las mejores prácticas REST API
 */
export class ResponseHandler {
    /**
     * Respuesta exitosa con datos (200 OK)
     * @param {Object} res - Objeto response de Express
     * @param {*} data - Datos a enviar
     * @param {string} message - Mensaje opcional
     */
    static success(res, data, message = 'Operación exitosa') {
        return res.status(200).json({
            success: true,
            message,
            data
        });
    }

    /**
     * Recurso creado exitosamente (201 Created)
     * @param {Object} res - Objeto response de Express
     * @param {*} data - Datos del recurso creado
     * @param {string} message - Mensaje opcional
     */
    static created(res, data, message = 'Recurso creado exitosamente') {
        return res.status(201).json({
            success: true,
            message,
            data
        });
    }

    /**
     * Respuesta exitosa sin contenido (204 No Content)
     * @param {Object} res - Objeto response de Express
     */
    static noContent(res) {
        return res.status(204).send();
    }

    /**
     * Error de validación del cliente (400 Bad Request)
     * @param {Object} res - Objeto response de Express
     * @param {string} message - Mensaje de error
     * @param {*} errors - Errores de validación opcionales
     */
    static badRequest(res, message = 'Solicitud inválida', errors = null) {
        const response = {
            success: false,
            message
        };
        if (errors) {
            response.errors = errors;
        }
        return res.status(400).json(response);
    }

    /**
     * Recurso no encontrado (404 Not Found)
     * @param {Object} res - Objeto response de Express
     * @param {string} message - Mensaje de error
     */
    static notFound(res, message = 'Recurso no encontrado') {
        return res.status(404).json({
            success: false,
            message
        });
    }

    /**
     * Error del servidor (500 Internal Server Error)
     * @param {Object} res - Objeto response de Express
     * @param {string} message - Mensaje de error
     * @param {Error} error - Objeto error opcional (solo en desarrollo)
     */
    static serverError(res, message = 'Error interno del servidor', error = null) {
        const response = {
            success: false,
            message
        };
        // Solo mostrar detalles del error en desarrollo
        if (process.env.NODE_ENV === 'development' && error) {
            response.error = error.message;
            response.stack = error.stack;
        }
        return res.status(500).json(response);
    }

    /**
     * Error no autorizado (401 Unauthorized)
     * @param {Object} res - Objeto response de Express
     * @param {string} message - Mensaje de error
     */
    static unauthorized(res, message = 'No autorizado') {
        return res.status(401).json({
            success: false,
            message
        });
    }

    /**
     * Error prohibido (403 Forbidden)
     * @param {Object} res - Objeto response de Express
     * @param {string} message - Mensaje de error
     */
    static forbidden(res, message = 'Acceso prohibido') {
        return res.status(403).json({
            success: false,
            message
        });
    }
}

/**
 * Middleware para manejar errores de manera centralizada
 * Convierte errores a formato unificado con ResponseHandler
 * @param {Error} err - Error object
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
export const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
    
    // Error de validación de Mongoose
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(error => ({
            field: error.path,
            message: error.message
        }));
        
        return ResponseHandler.badRequest(res, 'Error de validación', errors);
    }
    
    // Error de duplicado de Mongoose
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        return ResponseHandler.badRequest(res, `El campo ${field} ya existe`);
    }
    
    // Error de validación de Sequelize
    if (err.name === 'SequelizeValidationError') {
        const errors = err.errors.map(error => ({
            field: error.path,
            message: error.message
        }));
        return ResponseHandler.badRequest(res, 'Error de validación', errors);
    }
    
    // Error de duplicado de Sequelize
    if (err.name === 'SequelizeUniqueConstraintError') {
        const field = err.errors[0]?.path || 'campo';
        return ResponseHandler.badRequest(res, `El campo ${field} ya existe`);
    }
    
    // Error de conexión a base de datos
    if (err.name === 'MongoNetworkError' || err.name === 'MongoServerError' || err.name === 'SequelizeConnectionError') {
        return ResponseHandler.serverError(res, 'Error de conexión a la base de datos', err);
    }
    
    // Error de sintaxis JSON
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return ResponseHandler.badRequest(res, 'Formato JSON inválido');
    }
    
    // Error 404 personalizado
    if (err.status === 404 || err.message?.includes('no encontrado') || err.message?.includes('No encontrado')) {
        return ResponseHandler.notFound(res, err.message || 'Recurso no encontrado');
    }
    
    // Error 401 personalizado
    if (err.status === 401) {
        return ResponseHandler.unauthorized(res, err.message || 'No autorizado');
    }
    
    // Error 403 personalizado
    if (err.status === 403) {
        return ResponseHandler.forbidden(res, err.message || 'Acceso prohibido');
    }
    
    // Error 400 personalizado
    if (err.status === 400) {
        return ResponseHandler.badRequest(res, err.message || 'Solicitud inválida', err.errors);
    }
    
    // Error genérico (500)
    return ResponseHandler.serverError(res, err.message || 'Error interno del servidor', err);
};

/**
 * Middleware para manejar rutas no encontradas
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
export const notFound = (req, res, next) => {
    return ResponseHandler.notFound(res, `Ruta ${req.method} ${req.originalUrl} no encontrada`);
};

/**
 * Middleware para logging de requests
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
export const requestLogger = (req, res, next) => {
    const start = Date.now();
    
    // Filtrar requests de DevTools de Chrome y otros archivos comunes
    const isFilteredRequest = req.originalUrl.includes('.well-known/appspecific/com.chrome.devtools.json') ||
                             req.originalUrl === '/favicon.ico' ||
                             req.originalUrl === '/robots.txt' ||
                             req.originalUrl === '/sitemap.xml';
    
    if (!isFilteredRequest) {
        // Log del request
        console.log(`${req.method} ${req.originalUrl} - ${new Date().toISOString()}`);
    }
    
    // Interceptar el método end para loggear la respuesta
    const originalEnd = res.end;
    res.end = function(chunk, encoding) {
        const duration = Date.now() - start;
        
        if (!isFilteredRequest) {
            console.log(`${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
        }
        
        originalEnd.call(this, chunk, encoding);
    };
    
    next();
};

/**
 * Middleware para manejar errores asíncronos
 * Wrapper para funciones async que automáticamente captura errores
 * @param {Function} fn - Función async
 * @returns {Function} - Middleware function
 */
export const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
