/**
 * Middleware de manejo de errores
 * Maneja errores de manera centralizada y consistente
 */

/**
 * Middleware para manejar errores de manera centralizada
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
        
        return res.status(400).json({
            message: 'Validation error',
            code: 'MONGOOSE_VALIDATION_ERROR',
            errors
        });
    }
    
    // Error de duplicado de Mongoose
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        return res.status(400).json({
            message: `${field} already exists`,
            code: 'DUPLICATE_ERROR',
            field
        });
    }
    
    // Error de conexión a MongoDB
    if (err.name === 'MongoNetworkError' || err.name === 'MongoServerError') {
        return res.status(500).json({
            message: 'Database connection error',
            code: 'DATABASE_ERROR'
        });
    }
    
    // Error de sintaxis JSON
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            message: 'Invalid JSON format',
            code: 'INVALID_JSON'
        });
    }
    
    // Error genérico
    res.status(err.status || 500).json({
        message: err.message || 'Internal server error',
        code: err.code || 'INTERNAL_ERROR'
    });
};

/**
 * Middleware para manejar rutas no encontradas
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
export const notFound = (req, res, next) => {
    res.status(404).json({
        message: `Route ${req.method} ${req.originalUrl} not found`,
        code: 'ROUTE_NOT_FOUND'
    });
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
