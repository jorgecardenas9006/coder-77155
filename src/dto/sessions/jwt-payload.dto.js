import { UserResponseDto } from './user-response.dto.js';

/**
 * DTO para el payload del JWT
 * Formatea los datos que se incluyen en el token JWT
 */
export class JWTPayloadDto {
    constructor(user) {
        const userDto = new UserResponseDto(user);
        
        this.id = userDto.id;
        this.email = userDto.email;
        this.role = userDto.role;
        this.firstName = userDto.firstName;
        this.lastName = userDto.lastName;
        this.phone = userDto.phone;
        this.avatar = userDto.avatar;
        this.dateOfBirth = userDto.dateOfBirth;
        this.address = userDto.address;
        this.city = userDto.city;
        this.isActive = userDto.isActive;
        this.isEmailVerified = userDto.isEmailVerified;
        this.preferences = userDto.preferences;
    }

    /**
     * Convierte el DTO a un objeto plano para el JWT
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
}

