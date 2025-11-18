import jwt from 'jsonwebtoken';
import { env } from '../config/index.js';
import { ResponseHandler } from '../middlewares/index.js';
import { 
    UserResponseDto, 
    AuthResponseDto,
    JWTPayloadDto 
} from '../dto/sessions/index.js';

export class SessionsController {
    /**
     * Crea un token JWT con los datos del usuario usando DTO
     * @param {Object} user - Objeto usuario de MongoDB o JWT payload
     * @returns {string} Token JWT
     */
    _createJWTToken(user) {
        const payload = new JWTPayloadDto(user);
        return jwt.sign(payload.toJSON(), env.SECRET, { expiresIn: '24h' });
    }

    /**
     * Establece la cookie con el token JWT
     * @param {Object} res - Objeto response de Express
     * @param {string} token - Token JWT
     */
    _setTokenCookie(res, token) {
        res.cookie('coderCookie', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 86400000, // 24 horas
            sameSite: 'strict'
        });
    }

    async registerUser(req, res) {
        try {
            if (!req.user) {
                return ResponseHandler.badRequest(res, 'Error en el registro');
            }

            const token = this._createJWTToken(req.user);
            this._setTokenCookie(res, token);

            const authResponse = new AuthResponseDto(token, req.user);
            return ResponseHandler.created(res, authResponse.toJSON(), 'Usuario registrado exitosamente');
        } catch (error) {
            return ResponseHandler.serverError(res, 'Error al registrar el usuario', error);
        }
    }

    async loginUser(req, res) {
        try {
            if (!req.user) {
                return ResponseHandler.unauthorized(res, 'Usuario o contraseña no válidos');
            }

            const token = this._createJWTToken(req.user);
            this._setTokenCookie(res, token);

            const authResponse = new AuthResponseDto(token, req.user);
            return ResponseHandler.success(res, authResponse.toJSON(), 'Login exitoso');
        } catch (error) {
            return ResponseHandler.serverError(res, 'Error al loguear el usuario', error);
        }
    }

    async getCurrentUser(req, res) {
        try {
            if (!req.user) {
                return ResponseHandler.unauthorized(res, 'Usuario no autenticado');
            }

            const userResponse = new UserResponseDto(req.user);
            return ResponseHandler.success(res, { user: userResponse.toJSON() }, 'Usuario actual obtenido exitosamente');
        } catch (error) {
            return ResponseHandler.serverError(res, 'Error al obtener el usuario actual', error);
        }
    }
}
