import passport from "passport";
import local from "passport-local";
import github from "passport-github2"
import User from '../models/user.model.js';
import { createHash, isValidPassword } from "../utils/index.js";
import { env } from "../config/index.js";
import jwt from "passport-jwt"

const LocalStrategy = local.Strategy;
const GitHubStrategy = github.Strategy
const JWTStrategy = jwt.Strategy
const ExtractJWT = jwt.ExtractJwt

const cookieExtractor = (req) =>{
  let token = null
  // Buscar en cookie
  if (req && req.cookies && req.cookies.coderCookie) {
    token = req.cookies.coderCookie
  }
  // También buscar en header Authorization como fallback
  else if (req && req.headers && req.headers.authorization) {
    token = req.headers.authorization.split(' ')[1]
  }
  return token
}

//Middleware para errores de passport
const passportCall = (strategy) => {
    return async(req,res,next) => {
        passport.authenticate(strategy, function(err,user, info) {
            if(err) 
                return next(err)
            if(!user)
                return res.status(401).send({error: info.messages?info.messages: info.toString()})
            req.user = user
            return next()
        })(req, res, next)
    }
}


const initializePassport = () => {
  //Estrategia para usar jwt
  passport.use('jwt', new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
    secretOrKey: env.SECRET
  }, async (jwt_payload, done) => {
    try {
      return done(null, jwt_payload)
    } catch (error) {
      return done(error)
    }
  }))

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
  }));

  passport.use('github', new GitHubStrategy({
    clientID: env.GITHUB_CLIENT_ID,
    clientSecret: env.GITHUB_CLIENT_SECRET,
    callbackURL: `http://localhost:${env.PORT || 3000}/api/auth/githubcallback`
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      
      // Obtener email de diferentes fuentes posibles
      const email = profile._json.email || 
                   profile.emails?.[0]?.value
      
      const githubId = profile._json.id.toString();
      
      // Validaciones con mensajes específicos
      if (!email) {
        return done(null, false, { 
          message: 'No se pudo obtener el email de GitHub. Asegúrate de que tu cuenta tenga un email público.',
          code: 'NO_EMAIL'
        });
      }
      
      if (!githubId) {
        return done(null, false, { 
          message: 'No se pudo obtener el ID de GitHub. Inténtalo de nuevo.',
          code: 'NO_GITHUB_ID'
        });
      }
      
      // Buscar usuario por email o por githubId
      let user = await User.findOne({ 
        $or: [
          { email: email },
          { githubId: githubId }
        ]
      });
      
      if (!user) {
        // Crear nuevo usuario
        let newUser = {
          firstName: profile._json.name?.split(' ')[0] || profile._json.login || 'GitHub',
          lastName: profile._json.name?.split(' ')[1] || 'User',
          email: email,
          role: 'user',
          isActive: true,
          isEmailVerified: profile._json.email ? true : false,
          avatar: profile._json.avatar_url,
          githubId: githubId,
          preferences: {
            language: 'es',
            timezone: 'America/Argentina/Buenos_Aires',
            notifications: {
              email: true,
              push: true,
              sms: false
            }
          }
        };
        
        console.log('Creating new user:', newUser);
        user = await User.create(newUser);
        console.log('User created successfully:', user.email);
      } else {
        // Vincular GitHub ID a cuenta existente si es necesario
        if (!user.githubId) {
          user.githubId = githubId;
          user.avatar = profile._json.avatar_url;
          await user.save();
          console.log('Linked GitHub account to existing user:', user.email);
        } else if (user.githubId !== githubId) {
          return done(null, false, { 
            message: 'Ya existe una cuenta con este email vinculada a otro perfil de GitHub.',
            code: 'EMAIL_LINKED_TO_OTHER_GITHUB'
          });
        }
        console.log('User found:', user.email);
      }
      
      return done(null, user);
    } catch (error) {
      console.error('Error in GitHub strategy:', error);
      return done(null, false, { 
        message: 'Error interno del servidor. Inténtalo de nuevo más tarde.',
        code: 'INTERNAL_ERROR'
      });
    }
  }
));


};
export { passportCall };
export default initializePassport;