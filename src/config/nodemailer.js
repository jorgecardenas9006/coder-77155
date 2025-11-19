import nodemailer from 'nodemailer';
import { env } from './index.js';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: env.EMAIL_HOST || 'smtp.gmail.com',
    port: env.EMAIL_PORT || 587,
    secure: false, // true para 465, false para otros puertos
    auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASS,
    },
});

// Verificar conexión al iniciar (opcional)
transporter.verify((error, success) => {
    if (error) {
        console.error('❌ Error en configuración de email:', error);
    } else {
        console.log('✅ Servidor de email listo');
    }
});

export default transporter;