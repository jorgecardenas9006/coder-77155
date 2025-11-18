/**
 * Índice de modelos
 * Importa todos los modelos para que Sequelize los registre
 * Este archivo debe ser importado solo durante la inicialización de la base de datos
 */

// Importar todos los modelos
import './products.model.js';
import './sessions.model.js';

// Exportar todos los modelos para uso en DAOs
export { ProductsModel } from './products.model.js';
export { SessionsModel } from './sessions.model.js';
