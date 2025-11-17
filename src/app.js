import 'dotenv/config';
import express from 'express';
import indexRouter from './routes/index.router.js';
// Inicialización de la base de datos (importa modelos internamente)
import { initializeDatabase } from './dao/config/database.init.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', indexRouter);

// Inicializar conexión a la base de datos
initializeDatabase();

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

export default app;