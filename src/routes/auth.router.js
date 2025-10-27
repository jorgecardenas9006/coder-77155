import express from 'express'
import passport from 'passport';
import { validateLoginData, validateRegisterData, asyncHandler, isAuthenticated, handlePassportError, handleGitHubError, logOAuthError } from '../middlewares/index.js';
import { passportCall } from "../config/passport.config.js"
import jwt from 'jsonwebtoken'
import { env } from "../config/index.js";


const router = express.Router();

router.post('/register', validateRegisterData, passport.authenticate('register',{session: false, failureRedirect: '/failregister'}), asyncHandler ((req, res) =>{
  if (!req.user) return res.status(400).send({ status: "error", error: "Error en el registro"})
  
  // Crear token JWT con TODOS los campos necesarios para el perfil
  const token = jwt.sign(
    {
      id: req.user._id,
      email: req.user.email,
      role: req.user.role,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      phone: req.user.phone || '',
      avatar: req.user.avatar || '',
      dateOfBirth: req.user.dateOfBirth || null,
      address: req.user.address || '',
      city: req.user.city || '',
      isActive: req.user.isActive !== undefined ? req.user.isActive : true,
      isEmailVerified: req.user.isEmailVerified !== undefined ? req.user.isEmailVerified : false,
      preferences: {
        language: req.user.preferences?.language || 'es',
        timezone: req.user.preferences?.timezone || 'America/Argentina/Buenos_Aires',
        notifications: req.user.preferences?.notifications || {
          email: true,
          push: true,
          sms: false
        }
      }
    },
    env.SECRET,
    { expiresIn: "24h" }
  )

  // Enviar cookie con token JWT
  res.cookie('coderCookie', token, {
    httpOnly: true,
    secure: false,
    maxAge: 86400000 // 24 horas
  })
  
  res.json({ 
    status: "success", 
    message: "usuario registrado",
    token: token,
    user: {
      id: req.user._id,
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      role: req.user.role
    }
  })
}));

router.get('/failregister', async (req, res) =>{
  console.log('Error en la estrategia')
  res.send({ error: "failed"})
})

router.post('/login', validateLoginData, passport.authenticate('login', {session: false, failureRedirect: '/faillogin'}), asyncHandler((req, res) =>{
    if (!req.user) return res.status(401).send({ status: "error", error: "Usuario o contraseña no validos" })

    // Crear token JWT con TODOS los campos necesarios para el perfil
    const token = jwt.sign(
        {
            id: req.user._id,
            email: req.user.email,
            role: req.user.role,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            phone: req.user.phone || '',
            avatar: req.user.avatar || '',
            dateOfBirth: req.user.dateOfBirth || null,
            address: req.user.address || '',
            city: req.user.city || '',
            isActive: req.user.isActive !== undefined ? req.user.isActive : true,
            isEmailVerified: req.user.isEmailVerified !== undefined ? req.user.isEmailVerified : false,
            preferences: {
                language: req.user.preferences?.language || 'es',
                timezone: req.user.preferences?.timezone || 'America/Argentina/Buenos_Aires',
                notifications: req.user.preferences?.notifications || {
                    email: true,
                    push: true,
                    sms: false
                }
            }
        },
        env.SECRET,
        { expiresIn: "24h" }
    )

    // Enviar cookie con token JWT
    res.cookie('coderCookie', token, {
        httpOnly: true,
        secure: false,
        maxAge: 86400000 // 24 horas
    })

    res.json({ 
        status: "success", 
        message: "Login exitoso",
        token: token,
        user: {
            id: req.user._id,
            email: req.user.email,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            role: req.user.role
        }
    })
}));

router.get('/faillogin', (req, res) =>{
  res.send("login fallido")
})

//endpoint para obtener el perfil del usuario
router.get('/profile', passportCall('jwt'), asyncHandler(async(req, res) => {
    res.json({
        status: "success",
        user: req.user
    });
}));

//endpoint para deslogear al usuario
router.post('/logout', asyncHandler(async(req, res) => {
    // Limpiar cookie JWT
    res.clearCookie('coderCookie');
    res.json({ message: 'Logout successful' });
}));

router.get("/github", passport.authenticate("github",{scope:["user:email"]}))

// Callback de GitHub con manejo de errores mejorado
router.get("/githubcallback", 
  logOAuthError,
  handleGitHubError,
  handlePassportError,
  passport.authenticate("github", { session: false, failureRedirect: "/oauth-error" }), 
  asyncHandler((req, res) => {
    // Crear token JWT para GitHub login con TODOS los campos
    const token = jwt.sign(
      {
        id: req.user._id,
        email: req.user.email,
        role: req.user.role,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        phone: req.user.phone || '',
        avatar: req.user.avatar || '',
        dateOfBirth: req.user.dateOfBirth || null,
        address: req.user.address || '',
        city: req.user.city || '',
        isActive: req.user.isActive !== undefined ? req.user.isActive : true,
        isEmailVerified: req.user.isEmailVerified !== undefined ? req.user.isEmailVerified : false,
        preferences: {
          language: req.user.preferences?.language || 'es',
          timezone: req.user.preferences?.timezone || 'America/Argentina/Buenos_Aires',
          notifications: req.user.preferences?.notifications || {
            email: true,
            push: true,
            sms: false
          }
        }
      },
      env.SECRET,
      { expiresIn: "24h" }
    );

    // Enviar cookie con token JWT
    res.cookie('coderCookie', token, {
      httpOnly: true,
      secure: false,
      maxAge: 86400000 // 24 horas
    });
    
    console.log('GitHub login successful for:', req.user.email);
    res.redirect("/profile");
  })
);

router.get('/current', passportCall('jwt'), asyncHandler((req,res) =>{
  res.send(req.user)
}));

export default router;