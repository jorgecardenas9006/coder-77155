import { ProductsService } from '../services/products.service.js';
import { ResponseHandler } from '../middlewares/index.js';
import { CreateProductDto, UpdateProductDto } from '../dto/products/index.js';

export class ProductsController {
    constructor() {
        this.productsService = new ProductsService();
    }

    async getAllProducts(req, res) {
        try {
            const products = await this.productsService.getAllProducts();
            // Convertir DTOs a JSON para la respuesta
            const productsJson = products.map(product => product.toJSON());
            
            if (productsJson.length === 0) {
                return ResponseHandler.success(res, [], 'No hay productos disponibles');
            }
            return ResponseHandler.success(res, productsJson, 'Productos obtenidos exitosamente');
        } catch (error) {
            return ResponseHandler.serverError(res, 'Error al obtener productos', error);
        }
    }

    async getProductById(req, res) {
        try {
            const { id } = req.params;
            const product = await this.productsService.getProductById(id);
            
            return ResponseHandler.success(res, product.toJSON(), 'Producto obtenido exitosamente');
        } catch (error) {
            if (error.message.includes('no encontrado') || error.message.includes('No encontrado')) {
                return ResponseHandler.notFound(res, error.message);
            }
            return ResponseHandler.serverError(res, 'Error al obtener el producto', error);
        }
    }

    async createProduct(req, res) {
        try {
            // Crear DTO desde el body
            const createDto = new CreateProductDto(req.body);
            
            // Validar DTO
            const validation = createDto.validate();
            if (!validation.valid) {
                return ResponseHandler.badRequest(res, 'Datos inválidos', validation.errors);
            }

            const product = await this.productsService.createProduct(createDto);
            return ResponseHandler.created(res, product.toJSON(), 'Producto creado exitosamente');
        } catch (error) {
            return ResponseHandler.serverError(res, 'Error al crear el producto', error);
        }
    }

    async updateProduct(req, res) {
        try {
            const { id } = req.params;
            
            // Crear DTO desde el body
            const updateDto = new UpdateProductDto(req.body);
            
            // Validar DTO
            const validation = updateDto.validate();
            if (!validation.valid) {
                return ResponseHandler.badRequest(res, 'Datos inválidos', validation.errors);
            }

            const product = await this.productsService.updateProduct(id, updateDto);
            return ResponseHandler.success(res, product.toJSON(), 'Producto actualizado exitosamente');
        } catch (error) {
            if (error.message.includes('no encontrado') || error.message.includes('No encontrado')) {
                return ResponseHandler.notFound(res, error.message);
            }
            return ResponseHandler.serverError(res, 'Error al actualizar el producto', error);
        }
    }

    async deleteProduct(req, res) {
        try {
            const { id } = req.params;
            await this.productsService.deleteProduct(id);
            return ResponseHandler.success(res, { id }, 'Producto eliminado exitosamente');
        } catch (error) {
            if (error.message.includes('no encontrado') || error.message.includes('No encontrado')) {
                return ResponseHandler.notFound(res, error.message);
            }
            return ResponseHandler.serverError(res, 'Error al eliminar el producto', error);
        }
    }
}