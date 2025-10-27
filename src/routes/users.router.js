import express from 'express';
import User from '../models/user.model.js';
import { isAuthenticated, isAdmin } from '../middlewares/index.js'
import { passportCall } from '../config/passport.config.js';

const router = express.Router();

// GET /api/users - Obtener todos los usuarios (solo admin)
router.get('/', passportCall('jwt'), isAdmin, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los usuarios', error: error.message });
    }
});


// DELETE /api/users/:id - Eliminar usuario (solo admin)
router.delete('/:id', passportCall('jwt'), isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        
        // Verificar que no se esté eliminando a sí mismo
        if (req.user.id === id || req.user._id === id) {
            return res.status(400).json({ 
                message: 'No puedes eliminar tu propia cuenta',
                code: 'CANNOT_DELETE_SELF'
            });
        }
        
        const deletedUser = await User.findByIdAndDelete(id);
        
        if (!deletedUser) {
            return res.status(404).json({ 
                message: 'Usuario no encontrado',
                code: 'USER_NOT_FOUND'
            });
        }
        
        res.json({ 
            message: 'Usuario eliminado correctamente',
            deletedUser: {
                id: deletedUser._id,
                name: `${deletedUser.firstName} ${deletedUser.lastName}`,
                email: deletedUser.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el usuario', error: error.message });
    }
});

export default router;