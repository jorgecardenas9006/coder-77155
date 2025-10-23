import express from 'express';
import User from '../models/user.model.js';
import { isAuthenticated, asyncHandler } from '../middlewares/index.js';

const router = express.Router();

//endpoint para obtener todos los usuarios
router.get('/', asyncHandler(async (req, res) => {
    const users = await User.find();
    res.json(users);
}));

//endpoint para obtener el usuario autenticado
router.get('/me', isAuthenticated, (req, res) => {
    res.json(req.session.user);
});

export default router;