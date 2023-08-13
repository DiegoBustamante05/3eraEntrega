import express from "express";
import { ProductManager } from "../DAO/productManager.js";
import { ProductModel } from "../DAO/models/products.model.js";

const productManager = new ProductManager();

export const routerViewProducts = express.Router();




routerViewProducts.get("/", async (req, res) => {
        const { page } = req.query
        const limitedProducts = await ProductModel.paginate({}, { limit:9, page: page || 1 });
        const products = limitedProducts.docs.map(product=>{
            return{
                thumbnail: product.thumbnail,
                title: product.title,
                description: product.description,
                price: product.price,
                stock: product.stock,
                category: product.category,
            };
        });
        return res.render('home', { title: "Products", products: products, pagingCounter: limitedProducts.pagingCounter, totalPages: limitedProducts.totalPages, page: limitedProducts.page, hasPrevPage: limitedProducts.hasPrevPage, hasNextPage: limitedProducts.hasNextPage, prevPage: limitedProducts.prevPage, nextPage: limitedProducts.nextPage, firstName: req.session.firstName, lastName: req.session.lastName, firstName: req.user.firstName} );
});
