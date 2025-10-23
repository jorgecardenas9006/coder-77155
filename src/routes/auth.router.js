import express from 'express';
import User from '../models/user.model.js';
import { isAuthenticated, validateLoginData, asyncHandler } from '../middlewares/index.js';
import { createUserSessionData, createPublicUserData } from '../utils/user.dto.js';

const router = express.Router();

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
    req.session.destroy();
    res.json({ message: 'Logout successful' });
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