import { ProductsModel } from './models/products.model.js';

export class ProductsDao {

    async getAllProducts() {
        return await ProductsModel.findAll({
            order: [['id', 'ASC']]
        });
    }

    async getProductById(id) {
        return await ProductsModel.findByPk(id);
    }

    async createProduct(productData) {
        return await ProductsModel.create(productData);
    }

    async updateProduct(id, productData) {
        const product = await ProductsModel.findByPk(id);
        if (!product) {
            return null;
        }
        await product.update(productData);
        return product;
    }

    async deleteProduct(id) {
        const product = await ProductsModel.findByPk(id);
        if (!product) {
            return false;
        }
        await product.destroy();
        return true;
    }
}

