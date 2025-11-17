import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.config.js';

/**
 * Modelo de Producto usando Sequelize para PostgreSQL
 * Representa la tabla 'productos' en la base de datos
 */
class ProductsModel extends Model {
    /**
     * Inicializa el modelo y define la estructura de la tabla
     */
    static initModel() {
        return this.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                nombre: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notEmpty: true
                    }
                },
                categoria: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notEmpty: true
                    }
                },
                consola: {
                    type: DataTypes.JSONB,
                    allowNull: false,
                    defaultValue: {
                        plataformas: [],
                        tipos: []
                    },
                    validate: {
                        isValidConsola(value) {
                            if (!value.plataformas || !Array.isArray(value.plataformas)) {
                                throw new Error('consola.plataformas debe ser un array');
                            }
                            if (!value.tipos || !Array.isArray(value.tipos)) {
                                throw new Error('consola.tipos debe ser un array');
                            }
                        }
                    }
                },
                edadRecomendada: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    validate: {
                        isInt: true,
                        min: 0
                    }
                },
                precio: {
                    type: DataTypes.DECIMAL(10, 2),
                    allowNull: false,
                    validate: {
                        isDecimal: true,
                        min: 0
                    }
                },
                adicionales: {
                    type: DataTypes.JSONB,
                    allowNull: false,
                    defaultValue: {
                        multiplayer: false,
                        expansiones: []
                    },
                    validate: {
                        isValidAdicionales(value) {
                            if (typeof value.multiplayer !== 'boolean') {
                                throw new Error('adicionales.multiplayer debe ser un booleano');
                            }
                            if (!value.expansiones || !Array.isArray(value.expansiones)) {
                                throw new Error('adicionales.expansiones debe ser un array');
                            }
                        }
                    }
                },
                img: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notEmpty: true
                    }
                },
                descripcion: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    validate: {
                        notEmpty: true
                    }
                }
            },
            {
                sequelize,
                modelName: 'Product',
                tableName: 'productos',
                timestamps: true,
                underscored: false
            }
        );
    }
}

// Inicializar el modelo
ProductsModel.initModel();

export { ProductsModel };
