import express from 'express'
import passport from 'passport';
import { validateLoginData, validateRegisterData, asyncHandler, isAuthenticated, handlePassportError, handleGitHubError, logOAuthError } from '../middlewares/index.js';

const router = express.Router();

router.post('/register', passport.authenticate('register',{failureRedirect: '/failregister'}), validateRegisterData, asyncHandler ((req, res) =>{
  if (!req.user) return res.status(400).send({ status: "error", error: "Error en el registro"})
  
  req.session.user = {
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    email: req.user.email,
    phone: req.user.phone,
    role: req.user.role,
    avatar: req.user.avatar,
    dateOfBirth: req.user.dateOfBirth,
    address: req.user.address,
    city: req.user.city,
    isActive: req.user.isActive,
    isEmailVerified: req.user.isEmailVerified,
    preferences: req.user.preferences
  }
  
  res.send({ status: "success", message: "usuario registrado"})
}));

router.get('/failregister', async (req, res) =>{
  console.log('Error en la estrategia')
  res.send({ error: "failed"})
})

router.post('/login', passport.authenticate('login', {failureRedirect: '/faillogin'}), validateLoginData, asyncHandler((req, res) =>{
  if (!req.user) return res.status(400).send({ status: "error", error: "credenciales invalidas"})
  req.session.user = {
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    email: req.user.email,
    phone: req.user.phone,
    role: req.user.role,
    avatar: req.user.avatar,
    dateOfBirth: req.user.dateOfBirth,
    address: req.user.address,
    city: req.user.city,
    isActive: req.user.isActive,
    isEmailVerified: req.user.isEmailVerified,
    preferences: req.user.preferences
  } 
  res.send({status: "success"})
}));

router.get('/faillogin', (req, res) =>{
  res.send("login fallido")
})

//endpoint para obtener el perfil del usuario
router.get('/profile', isAuthenticated, asyncHandler(async(req, res) => {
    res.json({
        status: "success",
        user: req.session.user
    });
}));

//endpoint para deslogear al usuario
router.post('/logout', isAuthenticated, asyncHandler(async(req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Error during logout' });
        }
        res.json({ message: 'Logout successful' });
    });
}));

router.get("/github", passport.authenticate("github",{scope:["user:email"]}))

// Callback de GitHub con manejo de errores mejorado
router.get("/githubcallback", 
  logOAuthError,
  handleGitHubError,
  handlePassportError,
  passport.authenticate("github", { failureRedirect: "/oauth-error" }), 
  asyncHandler((req, res) => {
    // Estructurar req.session.user como en login/register para consistencia
    req.session.user = {
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      email: req.user.email,
      phone: req.user.phone,
      role: req.user.role,
      avatar: req.user.avatar,
      dateOfBirth: req.user.dateOfBirth,
      address: req.user.address,
      city: req.user.city,
      isActive: req.user.isActive,
      isEmailVerified: req.user.isEmailVerified,
      preferences: req.user.preferences
    };
    
    console.log('GitHub login successful for:', req.user.email);
    req.flash('success', '¡Autenticación con GitHub exitosa!');
    res.redirect("/profile");
  })
)

export default router;