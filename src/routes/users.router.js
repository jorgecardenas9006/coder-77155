import express from 'express';
import User from '../models/user.model.js';
import { isAuthenticated, asyncHandler } from '../middlewares/index.js';

const router = express.Router();

//endpoint para obtener todos los usuarios
router.get('/', asyncHandler(async (req, res) => {
    const users = await User.find();
    res.json(users);
}));

//endpoint para crear un nuevo usuario
router.post('/', asyncHandler(async (req, res) => {
    const user = await User.create(req.body);
    res.status(201).json({ message: 'Usuario creado correctamente', user });
}));

//endpoint para obtener el usuario autenticado
router.get('/me', isAuthenticated, (req, res) => {
    res.json(req.session.user);
});

export default router;