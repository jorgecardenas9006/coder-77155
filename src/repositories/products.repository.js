import { ProductsDao } from '../dao/products.dao.js';
import { CreateProductDto, UpdateProductDto, ProductResponseDto } from '../dto/products/index.js';

/**
 * Repositorio de productos
 * Capa de abstracción entre el servicio y el acceso a datos
 * Convierte entre DTOs (capa de dominio) y Modelos (capa de persistencia)
 */
export class ProductsRepository {
    constructor() {
        this.productsDao = new ProductsDao();
    }

    /**
     * Obtener todos los productos
     * @returns {Promise<Array<ProductResponseDto>>} Array de DTOs de productos
     */
    async getAllProducts() {
        const products = await this.productsDao.getAllProducts();
        return ProductResponseDto.fromModelArray(products);
    }

    /**
     * Obtener un producto por ID
     * @param {number|string} id - ID del producto
     * @returns {Promise<ProductResponseDto>} DTO del producto
     * @throws {Error} Si el producto no existe
     */
    async getProductById(id) {
        const product = await this.productsDao.getProductById(id);
        if (!product) {
            throw new Error(`Producto con ID ${id} no encontrado`);
        }
        return ProductResponseDto.fromModel(product);
    }

    /**
     * Crear un nuevo producto
     * @param {CreateProductDto} createDto - DTO con los datos del producto
     * @returns {Promise<ProductResponseDto>} DTO del producto creado
     */
    async createProduct(createDto) {
        const productData = createDto.toDatabase();
        const product = await this.productsDao.createProduct(productData);
        return ProductResponseDto.fromModel(product);
    }

    /**
     * Actualizar un producto
     * @param {number|string} id - ID del producto
     * @param {UpdateProductDto} updateDto - DTO con los datos a actualizar
     * @returns {Promise<ProductResponseDto>} DTO del producto actualizado
     * @throws {Error} Si el producto no existe
     */
    async updateProduct(id, updateDto) {
        const productData = updateDto.toDatabase();
        const product = await this.productsDao.updateProduct(id, productData);
        if (!product) {
            throw new Error(`Producto con ID ${id} no encontrado`);
        }
        return ProductResponseDto.fromModel(product);
    }

    /**
     * Eliminar un producto
     * @param {number|string} id - ID del producto
     * @returns {Promise<boolean>} true si se eliminó
     * @throws {Error} Si el producto no existe
     */
    async deleteProduct(id) {
        const deleted = await this.productsDao.deleteProduct(id);
        if (!deleted) {
            throw new Error(`Producto con ID ${id} no encontrado`);
        }
        return true;
    }
}