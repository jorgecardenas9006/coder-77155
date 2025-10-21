import express from 'express';

// Middleware para parsear el body de las peticiones
const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.listen(PORT, () => {
    console.log('Server is running on port 3000');
});

export default app;