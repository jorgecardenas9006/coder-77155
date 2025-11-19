import express from 'express';
import passport from 'passport';
import { validateLoginData, validateRegisterData, asyncHandler } from '../middlewares/index.js';
import { passportCall } from '../config/passport.config.js';
import { SessionsController } from '../controllers/sessions.controller.js';

const router = express.Router();
const sessionsController = new SessionsController();

// Rutas de fallo para redirects de Passport
router.get('/failregister', (req, res) => {
    res.status(401).json({ 
        success: false,
        message: 'Error en el registro' 
    });
});

router.get('/faillogin', (req, res) => {
    res.status(401).json({ 
        success: false,
        message: 'Error en el login' 
    });
});

// POST - Registrar un nuevo usuario
router.post(
    '/register', 
    validateRegisterData, 
    passport.authenticate('register', { session: false, failureRedirect: '/api/v1/sessions/failregister' }), 
    asyncHandler(sessionsController.registerUser.bind(sessionsController))
); 

// POST - Login
router.post(
    '/login', 
    validateLoginData, 
    passport.authenticate('login', { session: false, failureRedirect: '/api/v1/sessions/faillogin' }), 
    asyncHandler(sessionsController.loginUser.bind(sessionsController))
);

// GET - Obtener usuario actual (requiere JWT)
router.get(
    '/current',
    passportCall('jwt'),
    asyncHandler(sessionsController.getCurrentUser.bind(sessionsController))
);

// POST - Forgot password
router.post(
    '/forgotpassword',
    asyncHandler(sessionsController.forgotPassword.bind(sessionsController))
);

// Cmabio de contraseña
router.post(
    '/changepassword/:id',
    asyncHandler(sessionsController.changePassword.bind(sessionsController))
);

export default router;