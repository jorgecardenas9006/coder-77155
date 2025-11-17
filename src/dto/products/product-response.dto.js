/**
 * DTO para la respuesta de un producto
 * Formatea los datos que se envían al cliente
 */
export class ProductResponseDto {
    constructor(product) {
        // Si viene de Sequelize, puede ser una instancia del modelo
        const data = product?.dataValues || product || {};

        this.id = data.id;
        this.nombre = data.nombre;
        this.categoria = data.categoria;
        this.consola = data.consola || { plataformas: [], tipos: [] };
        this.edadRecomendada = data.edadRecomendada;
        // Convertir Decimal de Sequelize a número
        this.precio = data.precio ? parseFloat(data.precio) : 0;
        this.adicionales = data.adicionales || { multiplayer: false, expansiones: [] };
        this.img = data.img;
        this.descripcion = data.descripcion;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
    }

    /**
     * Convierte el DTO a un objeto plano para la respuesta JSON
     * @returns {Object}
     */
    toJSON() {
        return {
            id: this.id,
            nombre: this.nombre,
            categoria: this.categoria,
            consola: this.consola,
            edadRecomendada: this.edadRecomendada,
            precio: this.precio,
            adicionales: this.adicionales,
            img: this.img,
            descripcion: this.descripcion,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    /**
     * Crea un DTO desde un modelo de Sequelize
     * @param {Object} product - Instancia del modelo
     * @returns {ProductResponseDto}
     */
    static fromModel(product) {
        return new ProductResponseDto(product);
    }

    /**
     * Crea un array de DTOs desde un array de modelos
     * @param {Array} products - Array de instancias del modelo
     * @returns {Array<ProductResponseDto>}
     */
    static fromModelArray(products) {
        return products.map(product => ProductResponseDto.fromModel(product));
    }
}

