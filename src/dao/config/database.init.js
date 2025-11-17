/**
 * Inicialización de la base de datos
 * Este archivo se encarga de:
 * 1. Importar todos los modelos para que Sequelize los registre
 * 2. Probar la conexión
 * 3. Sincronizar los modelos con la base de datos
 * 
 * IMPORTANTE: Este archivo debe ser importado solo en app.js
 * para mantener la separación de responsabilidades.
 */

import { testConnection, syncDatabase } from './database.config.js';
// Importar todos los modelos para que Sequelize los registre
import '../models/index.js';


export const initializeDatabase = async () => {
    try {
        const connected = await testConnection();
        if (connected) {
            // Sincronizar modelos (crear tablas si no existen)
            await syncDatabase(false);
            return true;
        }
        return false;
    } catch (error) {
        console.error('❌ Error al inicializar la base de datos:', error.message);
        return false;
    }
};

