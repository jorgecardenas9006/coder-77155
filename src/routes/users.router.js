import express from 'express';
import User from '../models/user.model.js';
import { isAuthenticated, isAdmin } from '../middlewares/index.js'

const router = express.Router();

// GET /api/users - Obtener todos los usuarios (solo admin)
router.get('/', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los usuarios', error: error.message });
    }
});

// POST /api/users - Crear nuevo usuario
router.post('/', async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json({ message: 'Usuario creado correctamente'});
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el usuario', error: error.message });
    }
});

// DELETE /api/users/:id - Eliminar usuario (solo admin)
router.delete('/:id', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        
        // Verificar que no se esté eliminando a sí mismo
        if (req.session.user._id === id) {
            return res.status(400).json({ 
                message: 'No puedes eliminar tu propia cuenta',
                code: 'CANNOT_DELETE_SELF'
            });
        }
        
        const user = await User.findByIdAndDelete(id);
        
        if (!user) {
            return res.status(404).json({ 
                message: 'Usuario no encontrado',
                code: 'USER_NOT_FOUND'
            });
        }
        
        res.json({ 
            message: 'Usuario eliminado correctamente',
            deletedUser: {
                id: user._id,
                name: `${user.firstName} ${user.lastName}`,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el usuario', error: error.message });
    }
});

export default router;