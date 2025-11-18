import { UserResponseDto } from './user-response.dto.js';

/**
 * DTO para respuestas de autenticación (login/register)
 * Incluye el token JWT y los datos del usuario
 */
export class AuthResponseDto {
    constructor(token, user) {
        this.token = token;
        this.user = new UserResponseDto(user);
    }

    /**
     * Convierte el DTO a un objeto plano para la respuesta JSON
     * @returns {Object}
     */
    toJSON() {
        return {
            token: this.token,
            user: this.user.toJSON()
        };
    }
}

