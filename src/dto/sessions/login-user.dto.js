/**
 * DTO para el login de usuarios
 * Valida los datos de entrada para login
 */
export class LoginUserDto {
    constructor(data) {
        this.email = data.email?.toLowerCase().trim();
        this.password = data.password;
    }

    /**
     * Valida los datos del DTO
     * @returns {{valid: boolean, errors: string[]}}
     */
    validate() {
        const errors = [];

        if (!this.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
            errors.push('El email no es válido');
        }

        if (!this.password) {
            errors.push('La contraseña es requerida');
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }
}

