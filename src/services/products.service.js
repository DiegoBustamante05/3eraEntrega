import { ProductModel } from '../DAO/models/products.model.js';


export class ProductService {

  async getAllProducts(limit, page, query, sort) {
    const sortOption = sort == "asc" ? { price: 1 } : { price: -1 };
    const filter = query ? { category: query } : {};
    const products = await ProductModel.paginate(filter, {
      limit: limit,
      page: page,
      sort: sortOption,
    });
    return products;
  }

  async getById(id) {
    const product = await ProductModel.findById(id);
    return product;
  }

  async addProduct(product) {
    const productCreated = await ProductModel.create(product);
    return productCreated;
  }

  async deleteProduct(_id) {
    const deletedProduct = await ProductModel.deleteOne({ _id: _id });
    return deletedProduct;
  }

  async updateOne(id, newProduct) {
    if (!id) throw new Error('invalid _id');
  
    const uptadedProduct = await ProductModel.updateOne({ _id: id }, newProduct);
    return uptadedProduct;
  }
}


