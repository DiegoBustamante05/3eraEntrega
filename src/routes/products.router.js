import express from "express";
import {
    ProductManager
} from "../DAO/productManager.js";
import {
    ProductModel
} from "../DAO/models/products.model.js";
import {
    ProductService
} from '../services/products.service.js';
export const routerProducts = express.Router();


const productManager = new ProductManager();
const Service = new ProductService();

routerProducts.use(express.json());
routerProducts.use(express.urlencoded({
    extended: true
}));

routerProducts.get("/", async (req, res) => {
    try {
        const {
            limit = 10, page = 1, query, sort
        } = req.query;
        const products = await Service.getAllProducts(
            limit,
            page,
            query,
            sort
        );
        return res.status(200).json({
            payload: products.docs.map((product) => ({
                id: product._id.toString(),
                name: product.name,
                description: product.description,
                price: product.price,
                stock: product.stock,
                thumbnails: product.thumbnails,
                status: product.status,
                code: product.code,
                category: product.category,
            })),
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
        });
    } catch (error) {
        res.status(401).send(error);
    }
});



routerProducts.get("/:pid", async (req, res) => {
    try {
        let productId = req.params.pid;
        let productFound = await Service.getById(productId);
        res.status(200).send({
            status: "success",
            data: productFound,
        })
    } catch (error) {
        return res.status(404).send({
            error: 'Product not found'
        })
    }
});

routerProducts.post("/", async (req, res) => {
    try {
        const newProduct = req.body;
        await Service.addProduct(newProduct)
        return res.status(201).json({
            status: "success",
            msg: "Product created",
            data: newProduct,
        });
    } catch (error) {
        console.log(error)
        return res.status(404).send({
            error: 'Product not added'
        })
    }
})


routerProducts.delete("/:pid", async (req, res) => {
    try {
        const idToDelete = req.params.pid;
        await Service.deleteProduct(idToDelete);
        console.log("Product " + idToDelete + " deleted")
        return res.status(200).send({
            status: "success",
            msg: "Product deleted",
        })
    } catch (error) {
        console.log(error)
        return res.status(404).json({
            status: "error",
            msg: "could not be deleted",
            data: {},
        });
    }
});


routerProducts.put("/:pid", async (req, res) => {
    try {
        const id = req.params.pid;
        const newProduct = req.body;
        await Service.updateOne(id, newProduct);
        console.log("Product " + id + " was modified")
        return res.status(201).json({
            status: "success",
            msg: "successfully modified product",
            data: newProduct,
        });
    } catch (error) {
        console.log(error);
        return res.status(404).json({
            status: "error",
            msg: "could not be modified, check the entered fields",
            data: {},
        });
    }
});