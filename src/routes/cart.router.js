import express from 'express';
import {
    CartManager
} from '../DAO/cartManager.js';
import {
    cartsController
} from '../controllers/cart.controller.js';
import {
    CartService
} from '../services/carts.service.js';
const cartManager = new CartManager();


import { CartModel } from '../DAO/models/carts.model.js';
import { ProductModel } from '../DAO/models/products.model.js';
import { TicketModel } from '../DAO/models/ticket.model.js';





const Service = new CartService();
export const routerCarts = express.Router();
routerCarts.use(express.json());
routerCarts.use(
    express.urlencoded({
        extended: true,
    })
);

//faltan midlewares

routerCarts.get('/:cid', cartsController.getById);

routerCarts.post('/', cartsController.create);

routerCarts.post("/:cid/product/:pid", cartsController.addToCart);

routerCarts.delete('/:cid', cartsController.clearCart);

routerCarts.delete('/:cid/product/:pid', cartsController.deleteProductById);

routerCarts.put('/:cid/product/:pid', cartsController.updateProductQuantityInCart);

routerCarts.put('/:cid', cartsController.updateProductsInCart);

routerCarts.post('/:cid/purchase', async (req, res) => {
    const cartId = req.params.cid;
    try {
        const cart = await Service.findById(cartId);
        if (!cart) {
            return res.status(404).json({
                message: `cart: ${cartId}, not exist`
            });
        }
        return res.status(200).json({
            message: 'successful purchase'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Server Error'
        });
    }
});
