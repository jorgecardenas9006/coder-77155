import express from 'express'
import passport from 'passport';

const router = express.Router();

router.post('/register', passport.authenticate('register',{failureRedirect: '/failregister'}), async (req, res) =>{
  if (!req.user) return res.status(400).send({ status: "error", error: "Error en el registro"})
  
  // ✅ Agregar datos adicionales en la sesión (igual que en login)
  req.session.user = {
    first_name: req.user.firstName,
    last_name: req.user.lastName,
    role: req.user.role,
    avatar: req.user.avatar,
    fecha_nacimiento: req.user.dateOfBirth,
    direccion: req.user.address,
    ciudad: req.user.city
  }
  
  res.send({ status: "success", message: "usuario registrado"})
})

router.get('/failregister', async (req, res) =>{
  console.log('Error en la estrategia')
  res.send({ error: "failed"})
})

router.post('/login', passport.authenticate('login', {failureRedirect: '/faillogin'}), async (req, res) =>{
  if (!req.user) return res.status(400).send({ status: "error", error: "credenciales invalidas"})
  req.session.user = {
    first_name: req.user.firstName,
    last_name: req.user.lastName,
    role: req.user.role,
    avatar: req.user.avatar,
    fecha_nacimiento: req.user.dateOfBirth,
    direccion: req.user.address,
    ciudad: req.user.city
  } 
  res.send({status: "success"})
})

router.get('/faillogin', (req, res) =>{
  res.send("login fallido")
})

export default router;