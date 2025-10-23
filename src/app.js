import express from 'express';
import mongoose from 'mongoose';
import usersRouter from './routes/users.router.js';
import authRouter from './routes/auth.router.js';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { errorHandler, notFound, requestLogger } from './middlewares/index.js';


// variables de entorno
const app = express();
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGODB_URI;

// Middleware global para logging de requests
app.use(requestLogger);

// Middleware para parsear el body de las peticiones
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para manejar las cookies
app.use(cookieParser("secret"));

// Middleware para las sesiones
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// ruta para los usuarios
app.use('/api/users', usersRouter);

// ruta de autenticación
app.use('/api/auth', authRouter);

// Configuración de mongoose
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.log('Error connecting to MongoDB', err);
    });

// Middleware para manejar rutas no encontradas (debe ir antes del error handler)
app.use(notFound);

// Middleware global para manejo de errores (debe ir al final)
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;