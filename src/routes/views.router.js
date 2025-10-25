import express from 'express';
import { isAuthenticatedView, isAdminView, isModeratorView } from '../middlewares/index.js';

const router = express.Router();

//ruta de home
router.get('/', (req, res) => {
    res.render('home', { title: 'Home' });
});

//ruta de login
router.get('/login', (req, res) => {
    if (req.session.user) {
        return res.redirect('/profile');
    }
    res.render('layouts/login', { title: 'Login' });
});

//ruta de register
router.get('/register', (req, res) => {
    res.render('layouts/register', { title: 'Register' });
});

//ruta de profile
router.get('/profile', isAuthenticatedView, (req, res) => {
    res.render('layouts/profile', { 
        title: 'Profile',
        user: req.session.user 
    });
});

//ruta de usuarios (solo admin)
router.get('/users', isAdminView, (req, res) => {
    res.render('layouts/users', { 
        title: 'Gestión de Usuarios'
    });
});

//ruta de moderación (solo moderador o admin)
router.get('/moderation', isModeratorView, (req, res) => {
    res.render('layouts/moderation', { 
        title: 'Panel de Moderación',
        user: req.session.user
    });
});

//ruta recovery password
router.get('/recovery-password', (req, res) => {
    res.render('layouts/recover', { title: 'Recovery Password' });
});

//ruta de error OAuth
router.get('/oauth-error', (req, res) => {
    const errorMessage = req.flash('error')[0] || 'Error desconocido durante la autenticación';
    res.render('layouts/oauth-error', {
        title: 'Error de Autenticación',
        errorMessage: errorMessage
    });
});

export default router;