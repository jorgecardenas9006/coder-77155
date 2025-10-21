import express from 'express';
import mongoose from 'mongoose';

// variables de entorno
const app = express();
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGODB_URI;

// middleware para parsear el body de las peticiones
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// configuración de moongoose
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.log('Error connecting to MongoDB', err);
    });

app.listen(PORT, () => {
    console.log('Server is running on port 3000');
});

export default app;