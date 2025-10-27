import express from "express";
import { join, __dirname } from "./utils/index.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import usersRouter from './routes/users.router.js';
import sessionsRouter from './routes/sessions.router.js'
import viewsRouter from './routes/views.router.js';
import { env, connectDB } from "./config/index.js";
import cookieParser from "cookie-parser";
import passport from 'passport';
import initializePassport from './config/passport.config.js';
import { errorHandler, notFound, requestLogger } from './middlewares/index.js';
import handlebars from 'express-handlebars';

// variables de entorno
const app = express();

// Configuración de handlebars
app.engine('handlebars', handlebars.engine({
    helpers: {
        formatDate: function(date) {
            if (!date) return 'No especificada';
            return new Date(date).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        },
        eq: function(a, b) {
            return a === b;
        },
        or: function(a, b) {
            return a || b;
        }
    }
}));
app.set('view engine', 'handlebars');
app.set('views', join(__dirname, '..', 'views'));

// Middleware global para logging de requests
app.use(requestLogger);

// middleware para servir archivos estáticos
app.use(express.static(join(__dirname, '..', '..', 'public')));

// middleware para parsear el body de las peticiones
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Sesiones solo para OAuth error handling (no para autenticación principal)
app.use(
  session({
    secret: env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 } // 1 hora
  })
);

initializePassport();
app.use(passport.initialize());
// NO usar passport.session() porque usamos JWT

// ruta para los usuarios
app.use('/api/users', usersRouter);

// ruta para autenticación (sessions)
app.use('/api/sessions', sessionsRouter)

// ruta de home
app.use('/', viewsRouter);

// Conectar a la base de datos
connectDB(env.MONGO_URI);

// Middleware para manejar rutas no encontradas (debe ir antes del error handler)
app.use(notFound);

// Middleware global para manejo de errores (debe ir al final)
app.use(errorHandler);

app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
});

export default app;