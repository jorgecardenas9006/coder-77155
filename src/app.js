import express from "express";
import { join, __dirname } from "./utils/index.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import usersRouter from './routes/users.router.js';
import authRouter from './routes/auth.router.js'
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
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: env.MONGO_URI,
      ttl: 3200*20,
    }),
    secret: env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

// ruta para los usuarios
app.use('/api/users', usersRouter);

// ruta para autenticación
app.use('/api/auth', authRouter)

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