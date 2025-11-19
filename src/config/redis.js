import { createClient } from 'redis';
import { env } from './index.js';

const redisClient = createClient({
    socket: {
        host: env.REDIS_HOST || 'localhost',
        port: env.REDIS_PORT || 6379,
    }
});

redisClient.on('connect', () => {
    console.log('✅ Conectado a Redis');
});

redisClient.on('error', (err) => {
    console.error('❌ Error al conectar a Redis:', err);
});


export default redisClient;