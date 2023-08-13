import express from "express";
import { CartModel } from "../DAO/models/carts.model.js";
import { CartService } from "../services/carts.service.js";

const cartService = new CartService();

export const routerViewCart = express.Router();


routerViewCart.get("/:cid", async (req, res) => {
    const cid = req.params.cid 
    const cart = await cartService.getCartById(cid)
    console.log(cart)
    const products = cart.products.map((product) => {
        return{
        title: product.product.title,
        price: product.product.price,
        quantity: product.quantity
        }
    })
    return res.render('cart', { title: "Cart", products: products });
});