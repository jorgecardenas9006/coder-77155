import express from 'express';
import { ProductsController } from '../controllers/products.controller.js';
import { passportCall } from '../config/passport.config.js';
import { isAdmin } from '../middlewares/index.js';

const router = express.Router();

const productsController = new ProductsController();

// GET - Obtener todos los productos
router.get('/', productsController.getAllProducts.bind(productsController));

// GET - Obtener un producto por ID
router.get('/:id', productsController.getProductById.bind(productsController));

// POST - Crear un nuevo producto
router.post('/', passportCall('jwt'), isAdmin, productsController.createProduct.bind(productsController));

// PUT - Actualizar un producto
router.put('/:id', passportCall('jwt'), isAdmin, productsController.updateProduct.bind(productsController));

// DELETE - Eliminar un producto
router.delete('/:id', passportCall('jwt'), isAdmin, productsController.deleteProduct.bind(productsController));

export default router;