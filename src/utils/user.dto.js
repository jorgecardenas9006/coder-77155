/**
 * User Data Transfer Object (DTO)
 * Contiene solo los datos esenciales y seguros del usuario para la sesión
 */

/**
 * Convierte un documento de usuario de MongoDB a un objeto seguro para la sesión
 * @param {Object} user - Documento completo del usuario desde MongoDB
 * @returns {Object} Objeto con solo los datos esenciales para la sesión
 */
export const createUserSessionData = (user) => {
    return {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        isEmailVerified: user.isEmailVerified,
        preferences: {
            language: user.preferences?.language || 'es',
            timezone: user.preferences?.timezone || 'America/Argentina/Buenos_Aires'
        }
    };
};

/**
 * Convierte un documento de usuario de MongoDB a un objeto público (sin datos sensibles)
 * @param {Object} user - Documento completo del usuario desde MongoDB
 * @returns {Object} Objeto con datos públicos del usuario
 */
export const createPublicUserData = (user) => {
    return {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        isEmailVerified: user.isEmailVerified,
        avatar: user.avatar,
        dateOfBirth: user.dateOfBirth,
        address: user.address,
        city: user.city,
        preferences: user.preferences,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    };
};
