/**
 * DTO para la respuesta de un usuario
 * Formatea los datos que se envían al cliente
 */
export class UserResponseDto {
    constructor(user) {
        // Puede venir de MongoDB (req.user._id) o JWT (req.user.id)
        const data = user || {};
        const id = data._id || data.id;

        this.id = id?.toString();
        this.email = data.email;
        this.role = data.role;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.phone = data.phone || '';
        this.avatar = data.avatar || '';
        this.dateOfBirth = data.dateOfBirth || null;
        this.address = data.address || '';
        this.city = data.city || '';
        this.isActive = data.isActive !== undefined ? data.isActive : true;
        this.isEmailVerified = data.isEmailVerified !== undefined ? data.isEmailVerified : false;
        this.preferences = data.preferences || {
            language: 'es',
            timezone: 'America/Argentina/Buenos_Aires',
            notifications: {
                email: true,
                push: true,
                sms: false
            }
        };
    }

    /**
     * Convierte el DTO a un objeto plano para la respuesta JSON
     * @returns {Object}
     */
    toJSON() {
        return {
            id: this.id,
            email: this.email,
            role: this.role,
            firstName: this.firstName,
            lastName: this.lastName,
            phone: this.phone,
            avatar: this.avatar,
            dateOfBirth: this.dateOfBirth,
            address: this.address,
            city: this.city,
            isActive: this.isActive,
            isEmailVerified: this.isEmailVerified,
            preferences: this.preferences
        };
    }

    /**
     * Crea un DTO desde un modelo de MongoDB o JWT payload
     * @param {Object} user - Instancia del modelo o payload JWT
     * @returns {UserResponseDto}
     */
    static fromModel(user) {
        return new UserResponseDto(user);
    }

    /**
     * Crea un array de DTOs desde un array de modelos
     * @param {Array} users - Array de instancias del modelo
     * @returns {Array<UserResponseDto>}
     */
    static fromModelArray(users) {
        return users.map(user => UserResponseDto.fromModel(user));
    }
}

