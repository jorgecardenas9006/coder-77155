import express from 'express';
import User from '../models/user.model.js';
import { isAuthenticated, validateLoginData, validateRegisterData, asyncHandler } from '../middlewares/index.js';
import { createUserSessionData, createPublicUserData } from '../utils/user.dto.js';

const router = express.Router();

//endpoint de registro con validaciones de campos
router.post('/register', validateRegisterData, asyncHandler(async(req, res) => {
    const { firstName, lastName, email, password, phone, dateOfBirth, address, city } = req.body;
    
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists with this email' });
    }
    
    // Crear nuevo usuario
    const user = await User.create({
        firstName,
        lastName,
        email,
        password,
        phone,
        dateOfBirth,
        address,
        city
    });
    
    // Crear sesión automáticamente después del registro
    req.session.user = createUserSessionData(user);
    
    res.status(201).json({
        message: 'User registered successfully',
        user: createPublicUserData(user)
    });
}));

//endpoint de login con validaciones de campos
router.post('/login', validateLoginData, asyncHandler(async(req, res) => {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if(!user) {
        return res.status(400).json({ message: 'User not found' });
    }
    if(user.password !== password) {
        return res.status(400).json({ message: 'Invalid password' });
    }
    
    // Solo almacenar datos esenciales en la sesión
    req.session.user = createUserSessionData(user);
    res.json({ message: 'Login successful' });
}));

//endpoint para deslogear al usuario
router.post('/logout', isAuthenticated, asyncHandler(async(req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Error during logout' });
        }
        res.json({ message: 'Logout successful' });
    });
}));

//endpoint para obtener información completa del usuario autenticado
router.get('/profile', isAuthenticated, asyncHandler(async(req, res) => {
    const user = await User.findById(req.session.user._id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    
    // Retornar datos públicos completos (sin contraseña)
    res.json({
        message: 'User profile retrieved successfully',
        user: createPublicUserData(user)
    });
}));

//endpoint para obtener información básica de la sesión
router.get('/session', isAuthenticated, asyncHandler(async(req, res) => {
    res.json({
        message: 'Session data retrieved successfully',
        user: req.session.user
    });
}));

export default router;