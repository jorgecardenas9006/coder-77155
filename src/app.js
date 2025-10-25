import express from "express";
import { join, __dirname } from "./utils/index.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import usersRouter from './routes/users.router.js';
import authRouter from './routes/auth.router.js'
import { env, connectDB } from "./config/index.js";
import cookieParser from "cookie-parser";
import passport from 'passport';
import initializePassport from './config/passport.config.js';

// variables de entorno
const app = express();

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

// Conectar a la base de datos
connectDB(env.MONGO_URI);

app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
});

export default app;