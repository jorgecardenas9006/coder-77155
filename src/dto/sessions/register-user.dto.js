/**
 * DTO para el registro de usuarios
 * Valida y formatea los datos de entrada para registro
 */
export class RegisterUserDto {
    constructor(data) {
        this.firstName = data.firstName?.trim();
        this.lastName = data.lastName?.trim();
        this.email = data.email?.toLowerCase().trim();
        this.password = data.password;
        this.phone = data.phone?.trim();
        this.role = data.role || 'user';
        this.dateOfBirth = data.dateOfBirth;
        this.address = data.address?.trim();
        this.city = data.city?.trim();
        this.preferences = {
            language: data.preferences?.language || 'es',
            timezone: data.preferences?.timezone || 'America/Argentina/Buenos_Aires',
            notifications: {
                email: data.preferences?.notifications?.email ?? true,
                push: data.preferences?.notifications?.push ?? true,
                sms: data.preferences?.notifications?.sms ?? false
            }
        };
    }

    /**
     * Valida los datos del DTO
     * @returns {{valid: boolean, errors: string[]}}
     */
    validate() {
        const errors = [];

        if (!this.firstName || this.firstName.length < 2) {
            errors.push('El nombre debe tener al menos 2 caracteres');
        }

        if (!this.lastName || this.lastName.length < 2) {
            errors.push('El apellido debe tener al menos 2 caracteres');
        }

        if (!this.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
            errors.push('El email no es válido');
        }

        if (!this.password || this.password.length < 8) {
            errors.push('La contraseña debe tener al menos 8 caracteres');
        }

        if (this.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(this.phone)) {
            errors.push('El teléfono no es válido');
        }

        if (this.role && !['user', 'admin', 'moderator'].includes(this.role)) {
            errors.push('El rol no es válido');
        }

        if (this.dateOfBirth && new Date(this.dateOfBirth) >= new Date()) {
            errors.push('La fecha de nacimiento debe ser anterior a hoy');
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    /**
     * Convierte el DTO a formato para base de datos
     * @returns {Object}
     */
    toDatabase() {
        return {
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            phone: this.phone,
            role: this.role,
            dateOfBirth: this.dateOfBirth,
            address: this.address,
            city: this.city,
            preferences: this.preferences
        };
    }
}

