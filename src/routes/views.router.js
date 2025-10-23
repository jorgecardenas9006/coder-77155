import express from 'express';
import { isAuthenticated } from '../middlewares/index.js';

const router = express.Router();

//ruta de home
router.get('/', (req, res) => {
    res.render('home', { title: 'Home' });
});

//ruta de login
router.get('/login', (req, res) => {
    res.render('layouts/login', { title: 'Login' });
    if (req.session.user) {
        res.redirect('/profile');
    }
});

//ruta de register
router.get('/register', (req, res) => {
    res.render('layouts/register', { title: 'Register' });
});

//ruta de profile
router.get('/profile', isAuthenticated, (req, res) => {
    res.render('layouts/profile', { 
        title: 'Profile',
        user: req.session.user 
    });
});

//ruta recovery password
router.get('/recovery-password', (req, res) => {
    res.render('layouts/recover', { title: 'Recovery Password' });
});


export default router;