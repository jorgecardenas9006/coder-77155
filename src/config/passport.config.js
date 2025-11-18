import passport from "passport";
import local from "passport-local";
import jwt from "passport-jwt";
import { SessionsModel } from '../dao/models/sessions.model.js';
import { createHash, isValidPassword } from "../utils/index.js";
import { env } from "../config/index.js";
import { ResponseHandler } from "../middlewares/index.js";

const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

// Extractor de token JWT desde cookie o header
const cookieExtractor = (req) => {
    let token = null;
    // Buscar en cookie
    if (req && req.cookies && req.cookies.coderCookie) {
        token = req.cookies.coderCookie;
    }
    // También buscar en header Authorization como fallback
    else if (req && req.headers && req.headers.authorization) {
        token = req.headers.authorization.split(' ')[1];
    }
    return token;
};

// Middleware para errores de passport
const passportCall = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, function (err, user, info) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return ResponseHandler.unauthorized(res, info?.message || 'No autorizado');
            }
            req.user = user;
            return next();
        })(req, res, next);
    };
};


const initializePassport = () => {
  // Estrategia para usar JWT
  passport.use('jwt', new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
    secretOrKey: env.SECRET
  }, async (jwt_payload, done) => {
    try {
      // Opcional: verificar que el usuario aún existe en la BD
      const user = await SessionsModel.findById(jwt_payload.id);
      if (!user) {
        return done(null, false, { message: 'Usuario no encontrado' });
      }
      if (!user.isActive) {
        return done(null, false, { message: 'Usuario inactivo' });
      }
      // Retornar el payload del JWT (ya tiene toda la info del usuario)
      return done(null, jwt_payload);
    } catch (error) {
      return done(error);
    }
  }));

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
        let user = await SessionsModel.findOne({ email: email });
        if (user) {
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
        let result = await SessionsModel.create(newUser);
        return done(null, result);
    } catch (error) {
        return done(error);
    }
}))
  // Serialización de usuario para sesiones
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  // Deserialización de usuario para sesiones
  passport.deserializeUser(async (id, done) => {
    try {
      let user = await SessionsModel.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Estrategia para LOGIN
  passport.use('login', new LocalStrategy(
    { usernameField: 'email' }, 
    async (email, password, done) => {
      try {
        const user = await SessionsModel.findOne({ email: email });
        if (!user) {
          return done(null, false, { message: 'Usuario no encontrado' });
        }
        if (!isValidPassword(user, password)) {
          return done(null, false, { message: 'Contraseña incorrecta' });
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  ));
};
export { passportCall };
export default initializePassport;