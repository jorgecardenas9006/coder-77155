import { ProductsRepository } from '../repositories/products.repository.js';
import { CreateProductDto, UpdateProductDto, ProductResponseDto } from '../dto/products/index.js';

/**
 * Servicio de productos
 * Capa de lógica de negocio
 * Trabaja con DTOs para mantener la independencia de la capa de datos
 */
export class ProductsService {
    constructor() {
        this.productRepository = new ProductsRepository();
    }

    /**
     * Obtener todos los productos
     * @returns {Promise<Array<ProductResponseDto>>} Array de DTOs de productos
     */
    async getAllProducts() {
        return await this.productRepository.getAllProducts();
    }

    /**
     * Obtener un producto por ID
     * @param {number|string} id - ID del producto
     * @returns {Promise<ProductResponseDto>} DTO del producto
     * @throws {Error} Si el producto no existe
     */
    async getProductById(id) {
        return await this.productRepository.getProductById(id);
    }

    /**
     * Crear un nuevo producto
     * @param {CreateProductDto} createDto - DTO con los datos del producto
     * @returns {Promise<ProductResponseDto>} DTO del producto creado
     */
    async createProduct(createDto) {
        return await this.productRepository.createProduct(createDto);
    }

    /**
     * Actualizar un producto
     * @param {number|string} id - ID del producto
     * @param {UpdateProductDto} updateDto - DTO con los datos a actualizar
     * @returns {Promise<ProductResponseDto>} DTO del producto actualizado
     * @throws {Error} Si el producto no existe
     */
    async updateProduct(id, updateDto) {
        return await this.productRepository.updateProduct(id, updateDto);
    }

    /**
     * Eliminar un producto
     * @param {number|string} id - ID del producto
     * @returns {Promise<boolean>} true si se eliminó
     * @throws {Error} Si el producto no existe
     */
    async deleteProduct(id) {
        return await this.productRepository.deleteProduct(id);
    }
}