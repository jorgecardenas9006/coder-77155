export class CreateProductDto {
    constructor(data) {
        this.nombre = data.nombre;
        this.categoria = data.categoria;
        this.consola = {
            plataformas: data.consola?.plataformas || [],
            tipos: data.consola?.tipos || []
        };
        this.edadRecomendada = data.edadRecomendada;
        this.precio = data.precio;
        this.adicionales = {
            multiplayer: data.adicionales?.multiplayer || false,
            expansiones: data.adicionales?.expansiones || []
        };
        this.img = data.img;
        this.descripcion = data.descripcion;
    }

    validate() {
        const errors = [];

        if (!this.nombre || this.nombre.trim() === '') {
            errors.push('El nombre es requerido');
        }

        if (!this.categoria || this.categoria.trim() === '') {
            errors.push('La categoría es requerida');
        }

        if (!Array.isArray(this.consola.plataformas)) {
            errors.push('consola.plataformas debe ser un array');
        }

        if (!Array.isArray(this.consola.tipos)) {
            errors.push('consola.tipos debe ser un array');
        }

        if (typeof this.edadRecomendada !== 'number' || this.edadRecomendada < 0) {
            errors.push('edadRecomendada debe ser un número mayor o igual a 0');
        }

        if (typeof this.precio !== 'number' || this.precio < 0) {
            errors.push('precio debe ser un número mayor o igual a 0');
        }

        if (typeof this.adicionales.multiplayer !== 'boolean') {
            errors.push('adicionales.multiplayer debe ser un booleano');
        }

        if (!Array.isArray(this.adicionales.expansiones)) {
            errors.push('adicionales.expansiones debe ser un array');
        }

        if (!this.img || this.img.trim() === '') {
            errors.push('La imagen es requerida');
        }

        if (!this.descripcion || this.descripcion.trim() === '') {
            errors.push('La descripción es requerida');
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }


    toDatabase() {
        return {
            nombre: this.nombre,
            categoria: this.categoria,
            consola: this.consola,
            edadRecomendada: this.edadRecomendada,
            precio: this.precio,
            adicionales: this.adicionales,
            img: this.img,
            descripcion: this.descripcion
        };
    }
}

