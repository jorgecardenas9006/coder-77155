import express from 'express';
import { ProductsController } from '../controllers/products.controller.js';

const router = express.Router();

const productsController = new ProductsController();

// GET - Obtener todos los productos
router.get('/', productsController.getAllProducts.bind(productsController));

// GET - Obtener un producto por ID
router.get('/:id', productsController.getProductById.bind(productsController));

// POST - Crear un nuevo producto
router.post('/', productsController.createProduct.bind(productsController));

// PUT - Actualizar un producto
router.put('/:id', productsController.updateProduct.bind(productsController));

// DELETE - Eliminar un producto
router.delete('/:id', productsController.deleteProduct.bind(productsController));

export default router;