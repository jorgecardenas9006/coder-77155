/**
 * Middleware de validación de datos
 * Valida los datos de entrada antes de procesarlos
 */

/**
 * Valida los datos requeridos para login
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
export const validateLoginData = (req, res, next) => {
    const { email, password } = req.body;
    
    // Verificar si req.body existe
    if (!req.body) {
        return res.status(400).json({ 
            message: 'Request body is missing. Make sure to send JSON data with Content-Type: application/json',
            code: 'MISSING_BODY'
        });
    }
    
    // Verificar campos requeridos
    if (!email || !password) {
        return res.status(400).json({ 
            message: 'Email and password are required',
            code: 'MISSING_FIELDS',
            fields: {
                email: !email ? 'Email is required' : email,
                password: !password ? 'Password is required' : null
            }
        });
    }
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ 
            message: 'Invalid email format',
            code: 'INVALID_EMAIL'
        });
    }
    
    // Validar longitud de password
    if (password.length < 8) {
        return res.status(400).json({ 
            message: 'Password must be at least 8 characters long',
            code: 'INVALID_PASSWORD_LENGTH'
        });
    }
    
    next();
};

/**
 * Valida los datos requeridos para crear un usuario
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
export const validateUserData = (req, res, next) => {
    const { firstName, lastName, email, password } = req.body;
    
    // Verificar si req.body existe
    if (!req.body) {
        return res.status(400).json({ 
            message: 'Request body is missing. Make sure to send JSON data with Content-Type: application/json',
            code: 'MISSING_BODY'
        });
    }
    
    const errors = {};
    
    // Validar firstName
    if (!firstName) {
        errors.firstName = 'First name is required';
    } else if (firstName.length < 2 || firstName.length > 50) {
        errors.firstName = 'First name must be between 2 and 50 characters';
    }
    
    // Validar lastName
    if (!lastName) {
        errors.lastName = 'Last name is required';
    } else if (lastName.length < 2 || lastName.length > 50) {
        errors.lastName = 'Last name must be between 2 and 50 characters';
    }
    
    // Validar email
    if (!email) {
        errors.email = 'Email is required';
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errors.email = 'Invalid email format';
        }
    }
    
    // Validar password
    if (!password) {
        errors.password = 'Password is required';
    } else if (password.length < 8) {
        errors.password = 'Password must be at least 8 characters long';
    }
    
    // Si hay errores, devolverlos
    if (Object.keys(errors).length > 0) {
        return res.status(400).json({ 
            message: 'Validation errors',
            code: 'VALIDATION_ERROR',
            errors
        });
    }
    
    next();
};

/**
 * Valida el formato de email
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
export const validateEmail = (req, res, next) => {
    const { email } = req.body;
    
    if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                message: 'Invalid email format',
                code: 'INVALID_EMAIL'
            });
        }
    }
    
    next();
};

/**
 * Valida el formato de teléfono
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
export const validatePhone = (req, res, next) => {
    const { phone } = req.body;
    
    if (phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(phone)) {
            return res.status(400).json({ 
                message: 'Invalid phone format. Use international format (e.g., +5491123456789)',
                code: 'INVALID_PHONE'
            });
        }
    }
    
    next();
};

/**
 * Valida los datos requeridos para registro de usuario
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
export const validateRegisterData = (req, res, next) => {
    const { firstName, lastName, email, password, phone, dateOfBirth, address, city } = req.body;
    
    // Verificar si req.body existe
    if (!req.body) {
        return res.status(400).json({ 
            message: 'Request body is missing. Make sure to send JSON data with Content-Type: application/json',
            code: 'MISSING_BODY'
        });
    }
    
    const errors = {};
    
    // Validar firstName
    if (!firstName) {
        errors.firstName = 'First name is required';
    } else if (firstName.length < 2 || firstName.length > 50) {
        errors.firstName = 'First name must be between 2 and 50 characters';
    }
    
    // Validar lastName
    if (!lastName) {
        errors.lastName = 'Last name is required';
    } else if (lastName.length < 2 || lastName.length > 50) {
        errors.lastName = 'Last name must be between 2 and 50 characters';
    }
    
    // Validar email
    if (!email) {
        errors.email = 'Email is required';
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errors.email = 'Invalid email format';
        }
    }
    
    // Validar password
    if (!password) {
        errors.password = 'Password is required';
    } else if (password.length < 8) {
        errors.password = 'Password must be at least 8 characters long';
    }
    
    // Validar phone (opcional pero con formato si se proporciona)
    if (phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(phone)) {
            errors.phone = 'Invalid phone format. Use international format (e.g., +5491123456789)';
        }
    }
    
    // Validar dateOfBirth (opcional pero con formato si se proporciona)
    if (dateOfBirth) {
        const birthDate = new Date(dateOfBirth);
        const today = new Date();
        if (birthDate >= today) {
            errors.dateOfBirth = 'Date of birth must be in the past';
        }
    }
    
    // Validar address (opcional pero con longitud si se proporciona)
    if (address && address.length > 200) {
        errors.address = 'Address cannot exceed 200 characters';
    }
    
    // Validar city (opcional pero con longitud si se proporciona)
    if (city && city.length > 50) {
        errors.city = 'City cannot exceed 50 characters';
    }
    
    // Si hay errores, devolverlos
    if (Object.keys(errors).length > 0) {
        return res.status(400).json({ 
            message: 'Validation errors',
            code: 'VALIDATION_ERROR',
            errors
        });
    }
    
    next();
};
