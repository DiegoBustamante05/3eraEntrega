import express from "express";
import { ProductManager } from "../DAO/productManager.js";

const productManager = new ProductManager();

export const routerViewRealTimeProducts = express.Router();




routerViewRealTimeProducts.get("/", async (req, res) => {
    try {
        const products = await productManager.getProducts();
        return res.render('realTimeProducts', { title: "Real time products", products: products} );
    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: "error getting products" })
    }
});