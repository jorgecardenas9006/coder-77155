/**
 * Módulo de manejo de cierre graceful de la aplicación
 * Maneja el cierre seguro del servidor y conexiones
 */

/**
 * Configura el manejo de eventos de cierre para la aplicación
 * @param {Object} server - Instancia del servidor HTTP de Express
 * @param {Object} mongoose - Instancia de Mongoose para cerrar conexión DB
 */
export const setupGracefulShutdown = (server, mongoose) => {
    // Configurar límites de listeners para evitar warnings
    process.setMaxListeners(15);

    // Función para cerrar la aplicación de forma segura
    const gracefulShutdown = async (signal) => {
        console.log(`\n${signal} received. Starting graceful shutdown...`);
        
        try {
            // Cerrar el servidor HTTP
            server.close(() => {
                console.log('HTTP server closed');
            });
            
            // Cerrar la conexión a MongoDB
            await mongoose.connection.close();
            console.log('MongoDB connection closed');
            
            console.log('Graceful shutdown completed');
            process.exit(0);
        } catch (error) {
            console.error('Error during graceful shutdown:', error);
            process.exit(1);
        }
    };

    // Registrar listeners para diferentes señales de cierre
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Manejar errores no capturados
    process.on('uncaughtException', (error) => {
        console.error('Uncaught Exception:', error);
        gracefulShutdown('UNCAUGHT_EXCEPTION');
    });

    process.on('unhandledRejection', (reason, promise) => {
        console.error('Unhandled Rejection at:', promise, 'reason:', reason);
        gracefulShutdown('UNHANDLED_REJECTION');
    });

    console.log('Graceful shutdown handlers configured');
};
