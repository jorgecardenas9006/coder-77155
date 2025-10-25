import passport from "passport";
import local from "passport-local";
import User from '../models/user.model.js';
import { createHash, isValidPassword } from "../utils/index.js";

const LocalStrategy = local.Strategy;

const initializePassport = () => {
  // Estrategia para REGISTRO - llamada "register"
  passport.use('register', new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    }, async (req, email, password, done) =>{
    const {
          firstName,
          lastName,
          phone,
          role, // Valor por defecto
          dateOfBirth,
          address,
          city,
          preferences = {} // Valor por defecto
        } = req.body;
    try {
        let user = await User.findOne({ email: email })
        if(user) {
            console.log("El usuario existe");
            return done(null, false, { message: 'El usuario ya existe' });
        }
        const newUser = {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email,
          phone: phone?.trim(),
          role: role,
          isActive: true,
          isEmailVerified: false,
          dateOfBirth,
          address: address?.trim(),
          city: city?.trim(),
          preferences: {
            language: preferences.language,
            timezone: preferences.timezone,
            notifications: {
              email: preferences.notifications?.email ?? true,
              push: preferences.notifications?.push ?? true,
              sms: preferences.notifications?.sms ?? false
            }
          },
          password: createHash(password)
        };
        let result = await User.create(newUser);
        return done(null, result)
    } catch (error) {
        return done("Error al obtener el usuario" + error)
    }
}))
  //
  passport.serializeUser((user, done) => {
    done(null, user._id)
  })
  //
  passport.deserializeUser(async (id, done) => {
    try {
      let user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  //
  passport.use('login', new LocalStrategy({usernameField: 'email'}, async (email, password, done) =>{
    try {
      const user = await User.findOne({ email: email})
      if (!user) {
        console.log("usuario no encontrado")
        return done(null, false)
      }
      if (!isValidPassword(user, password)) return done(null, false)
      return done(null, user)
    } catch (error) {
      return done(error)
    }
  }))


};

export default initializePassport;