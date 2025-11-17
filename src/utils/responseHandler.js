/**
 * Utilidad para manejar respuestas HTTP de manera consistente
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

