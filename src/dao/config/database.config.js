import { Sequelize } from 'sequelize';

/**
 * Configuración de conexión a PostgreSQL usando Sequelize
 */
const sequelize = new Sequelize(
    process.env.POSTGRES_DB || 'postgres',
    process.env.POSTGRES_USER || 'postgres',
    process.env.POSTGRES_PASSWORD || 'postgres',
    {
        host: process.env.POSTGRES_HOST || 'localhost',
        port: process.env.POSTGRES_PORT || 5432,
        dialect: 'postgres',
        logging: false,
        //logging: process.env.NODE_ENV === 'development' ? console.log : false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

/**
 * Función para probar la conexión a la base de datos
 */
export const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexión a PostgreSQL establecida correctamente.');
        return true;
    } catch (error) {
        console.error('❌ Error al conectar con PostgreSQL:');
        console.error('   Mensaje:', error.message || 'Sin mensaje de error');
        console.error('   Host:', process.env.POSTGRES_HOST || 'localhost');
        console.error('   Puerto:', process.env.POSTGRES_PORT || 5432);
        console.error('   Base de datos:', process.env.POSTGRES_DB || 'postgres');
        console.error('   Usuario:', process.env.POSTGRES_USER || 'postgres');
        if (error.original) {
            console.error('   Error original:', error.original.message || error.original);
        }
        if (error.stack) {
            console.error('   Stack:', error.stack);
        }
        return false;
    }
};


export const syncDatabase = async (force = false) => {
    try {
        await sequelize.sync({ force });
        console.log('✅ Base de datos sincronizada correctamente.');
        return true;
    } catch (error) {
        console.error('❌ Error al sincronizar la base de datos:', error.message);
        return false;
    }
};

export default sequelize;

