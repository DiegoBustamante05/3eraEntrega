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

const Service = new CartService();
export const routerCarts = express.Router();
routerCarts.use(express.json());
routerCarts.use(
    express.urlencoded({
        extended: true,
    })
);



routerCarts.get('/:cid', cartsController.getById);

routerCarts.post('/', cartsController.create);

routerCarts.post("/:cid/product/:pid", /*checkCartOwner,*/ cartsController.addToCart);

routerCarts.delete('/:cid', cartsController.clearCart);

routerCarts.delete('/:cid/product/:pid', cartsController.deleteProductById);

routerCarts.put('/:cid/product/:pid', cartsController.updateProductQuantityInCart);

routerCarts.put('/:cid', cartsController.updateProductsInCart);

routerCarts.post('/:cid/purchase', cartsController.purchase)