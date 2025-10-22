import express from 'express';
import User from '../models/user.model.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los usuarios', error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json({ message: 'Usuario creado correctamente', user });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el usuario', error: error.message });
    }
});

export default router;