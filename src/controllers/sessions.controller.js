import jwt from 'jsonwebtoken';
import { env } from '../config/index.js';
import { ResponseHandler } from '../middlewares/index.js';

export class SessionsController {
    /**
     * Crea un token JWT con los datos del usuario
     * @param {Object} user - Objeto usuario de MongoDB
     * @returns {string} Token JWT
     */
    _createJWTToken(user) {
        return jwt.sign(
            {
                id: user._id,
                email: user.email,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone || '',
                avatar: user.avatar || '',
                dateOfBirth: user.dateOfBirth || null,
                address: user.address || '',
                city: user.city || '',
                isActive: user.isActive !== undefined ? user.isActive : true,
                isEmailVerified: user.isEmailVerified !== undefined ? user.isEmailVerified : false,
                preferences: {
                    language: user.preferences?.language || 'es',
                    timezone: user.preferences?.timezone || 'America/Argentina/Buenos_Aires',
                    notifications: {
                        email: user.preferences?.notifications?.email ?? true,
                        push: user.preferences?.notifications?.push ?? true,
                        sms: user.preferences?.notifications?.sms ?? false
                    }
                }
            },
            env.SECRET,
            { expiresIn: '24h' }
        );
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

            return ResponseHandler.created(res, {
                token,
                user: {
                    id: req.user._id,
                    email: req.user.email,
                    firstName: req.user.firstName,
                    lastName: req.user.lastName
                }
            }, 'Usuario registrado exitosamente');
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

            return ResponseHandler.success(res, {
                token,
                user: {
                    id: req.user._id,
                    email: req.user.email,
                    firstName: req.user.firstName,
                    lastName: req.user.lastName
                }
            }, 'Login exitoso');
        } catch (error) {
            return ResponseHandler.serverError(res, 'Error al loguear el usuario', error);
        }
    }

    async getCurrentUser(req, res) {
        try {
            if (!req.user) {
                return ResponseHandler.unauthorized(res, 'Usuario no autenticado');
            }

            // req.user viene del JWT payload, ya tiene toda la información
            return ResponseHandler.success(res, {
                user: {
                    id: req.user.id,
                    email: req.user.email,
                    role: req.user.role,
                    firstName: req.user.firstName,
                    lastName: req.user.lastName,
                    phone: req.user.phone || '',
                    avatar: req.user.avatar || '',
                    dateOfBirth: req.user.dateOfBirth || null,
                    address: req.user.address || '',
                    city: req.user.city || '',
                    isActive: req.user.isActive,
                    isEmailVerified: req.user.isEmailVerified,
                    preferences: req.user.preferences
                }
            }, 'Usuario actual obtenido exitosamente');
        } catch (error) {
            return ResponseHandler.serverError(res, 'Error al obtener el usuario actual', error);
        }
    }
}
