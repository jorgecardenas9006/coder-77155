import express from 'express';
import indexRouter from './routes/index.router.js';
// Inicialización de la base de datos (importa modelos internamente)
import { initializeDatabase } from './dao/config/database.init.js';
import { connectDB } from './dao/config/mongo.config.js';
import { env } from './config/index.js';
import cookieParser from 'cookie-parser';
import { requestLogger, errorHandler, notFound } from './middlewares/index.js';
import initializePassport from './config/passport.config.js';
import passport from 'passport';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Inicializar Passport (debe ir después de session)
initializePassport();
app.use(passport.initialize());


// Middleware global para logging de requests (debe ir antes de las rutas)
app.use(requestLogger);

app.use('/', indexRouter);

// Middleware para rutas no encontradas (debe ir después de las rutas)
app.use(notFound);

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

// Inicializar conexión a la base de datos
initializeDatabase();

// Inicializar conexión a MongoDB
connectDB(env.MONGODB_URI);

app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
});

export default app;