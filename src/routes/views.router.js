import express from 'express';
import { isAdmin, isModerator, asyncHandler } from '../middlewares/index.js';
import { passportCall } from '../config/passport.config.js';

const router = express.Router();

//ruta de home
router.get('/', (req, res) => {
    res.render('home', { title: 'Home' });
});

//ruta de login
router.get('/login', (req, res) => {
    // Verificar si ya tiene cookie JWT
    if (req.cookies.coderCookie) {
        return res.redirect('/profile');
    }
    res.render('layouts/login', { title: 'Login' });
});

//ruta de register
router.get('/register', (req, res) => {
    res.render('layouts/register', { title: 'Register' });
});

//ruta de profile
router.get('/profile', passportCall('jwt'), (req, res) => {
    res.render('layouts/profile', { 
        title: 'Profile',
        user: req.user 
    });
});

//ruta de usuarios (solo admin)
router.get('/users', passportCall('jwt'), isAdmin, asyncHandler(async(req, res) => {
    res.render('layouts/users', { 
        title: 'Gestión de Usuarios',
        user: req.user
    });
}));

//ruta de moderación (solo moderador o admin)
router.get('/moderation', passportCall('jwt'), isModerator, (req, res) => {
    res.render('layouts/moderation', { 
        title: 'Panel de Moderación',
        user: req.user
    });
});

//ruta recovery password
router.get('/recovery-password', (req, res) => {
    res.render('layouts/recover', { title: 'Recovery Password' });
});

//ruta de error OAuth
router.get('/oauth-error', (req, res) => {
    const errorMessage = req.session?.errorMessage || 'Error desconocido durante la autenticación';
    // Limpiar mensaje después de mostrarlo
    if (req.session) {
      delete req.session.errorMessage;
    }
    res.render('layouts/oauth-error', {
        title: 'Error de Autenticación',
        errorMessage: errorMessage
    });
});

export default router;