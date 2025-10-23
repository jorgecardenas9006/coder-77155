import express from 'express';
import mongoose from 'mongoose';
import usersRouter from './routes/users.router.js';
import authRouter from './routes/auth.router.js';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { errorHandler, notFound, requestLogger } from './middlewares/index.js';
import MongoStore from 'connect-mongo';
import handlebars from 'express-handlebars';
import { join, __dirname, setupGracefulShutdown } from './utils/index.js';


// variables de entorno
const app = express();
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGODB_URI;
const SECRET = process.env.SECRET;

// Configuración de handlebars
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', join(__dirname, 'views'));

// Middleware global para logging de requests
app.use(requestLogger);

// Middleware para parsear el body de las peticiones
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para servir archivos estáticos
app.use(express.static(join(__dirname, '..', 'public')));

// Middleware para manejar las cookies
app.use(cookieParser(SECRET));

// Guardar la sesión en la base de datos mongo DB con connect-mongo
app.use(session({
    secret: SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: MONGO_URI,
        ttl: 240
    })
}));


// ruta para los usuarios
app.use('/api/users', usersRouter);

// ruta de autenticación
app.use('/api/auth', authRouter);

// ruta de home
app.get('/', (req, res) => {
    res.render('home', { title: 'Home' });
});

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

// Graceful shutdown - manejo adecuado de eventos de cierre
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Configurar el manejo de cierre graceful
setupGracefulShutdown(server, mongoose);

export default app;