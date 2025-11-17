/**
 * DTO para actualizar un producto
 * Solo incluye los campos que se pueden actualizar
 */
export class UpdateProductDto {
    constructor(data) {
        // Todos los campos son opcionales en update
        this.nombre = data.nombre;
        this.categoria = data.categoria;
        this.consola = data.consola;
        this.edadRecomendada = data.edadRecomendada;
        this.precio = data.precio;
        this.adicionales = data.adicionales;
        this.img = data.img;
        this.descripcion = data.descripcion;
    }

    /**
     * Valida los datos del DTO (solo valida campos presentes)
     * @returns {Object} { valid: boolean, errors: string[] }
     */
    validate() {
        const errors = [];

        if (this.nombre !== undefined && this.nombre.trim() === '') {
            errors.push('El nombre no puede estar vacío');
        }

        if (this.categoria !== undefined && this.categoria.trim() === '') {
            errors.push('La categoría no puede estar vacía');
        }

        if (this.consola !== undefined) {
            if (!this.consola.plataformas || !Array.isArray(this.consola.plataformas)) {
                errors.push('consola.plataformas debe ser un array');
            }
            if (!this.consola.tipos || !Array.isArray(this.consola.tipos)) {
                errors.push('consola.tipos debe ser un array');
            }
        }

        if (this.edadRecomendada !== undefined && (typeof this.edadRecomendada !== 'number' || this.edadRecomendada < 0)) {
            errors.push('edadRecomendada debe ser un número mayor o igual a 0');
        }

        if (this.precio !== undefined && (typeof this.precio !== 'number' || this.precio < 0)) {
            errors.push('precio debe ser un número mayor o igual a 0');
        }

        if (this.adicionales !== undefined) {
            if (this.adicionales.multiplayer !== undefined && typeof this.adicionales.multiplayer !== 'boolean') {
                errors.push('adicionales.multiplayer debe ser un booleano');
            }
            if (this.adicionales.expansiones !== undefined && !Array.isArray(this.adicionales.expansiones)) {
                errors.push('adicionales.expansiones debe ser un array');
            }
        }

        if (this.img !== undefined && this.img.trim() === '') {
            errors.push('La imagen no puede estar vacía');
        }

        if (this.descripcion !== undefined && this.descripcion.trim() === '') {
            errors.push('La descripción no puede estar vacía');
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    /**
     * Convierte el DTO a un objeto plano, eliminando campos undefined
     * @returns {Object}
     */
    toDatabase() {
        const data = {};
        
        if (this.nombre !== undefined) data.nombre = this.nombre;
        if (this.categoria !== undefined) data.categoria = this.categoria;
        if (this.consola !== undefined) data.consola = this.consola;
        if (this.edadRecomendada !== undefined) data.edadRecomendada = this.edadRecomendada;
        if (this.precio !== undefined) data.precio = this.precio;
        if (this.adicionales !== undefined) data.adicionales = this.adicionales;
        if (this.img !== undefined) data.img = this.img;
        if (this.descripcion !== undefined) data.descripcion = this.descripcion;

        return data;
    }
}

