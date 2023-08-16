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

import {
    CartModel
} from '../DAO/models/carts.model.js';
import {
    ProductModel
} from '../DAO/models/products.model.js';
import {
    TicketModel
} from '../DAO/models/ticket.model.js';

import generateTicketCode from '../services/ticket.service.js';



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
        // Encontrar el carrito en MongoDB y popula los productos
        const cart = await CartModel.findById(cartId).populate('products.product');

        if (!cart) {
            return res.status(404).json({
                error: 'Carrito no encontrado'
            });
        }

        // Verificar el stock y monto total de la compra
        const productsToPurchase = cart.products;
        let totalPrice = 0;
        const purchasedProducts = [];
        const productsNotPurchased = [];

        for (const productItem of productsToPurchase) {
            const product = productItem.product;

            if (!product) {
                productsNotPurchased.push(productItem);
                continue;
            }

            if (product.stock >= productItem.quantity) {
                totalPrice += product.price * productItem.quantity;
                purchasedProducts.push({
                    product: product._id,
                    title:  product.title,
                    quantity: productItem.quantity
                });
                product.stock -= productItem.quantity;
                await product.save();
            } else {
                productsNotPurchased.push(productItem);
            }
        }

        if (purchasedProducts.length > 0) {
            // Crear un registro de ticket en MongoDB para la compra
            const ticket = new TicketModel({
                code: await  generateTicketCode(), // Debes implementar esta función
                purchase_datetime: new Date().toISOString(),
                amount: totalPrice,
                purchaser: cart.user,
                purchasedProducts: purchasedProducts,
            });

            await ticket.save();

            // Actualizar los productos no comprados en el carrito
            cart.products = productsNotPurchased;
            await cart.save();

            return res.json({
                message: 'Compra exitosa',
                ticket: ticket
            });
        } else {
            return res.status(400).json({
                error: 'No se pudo comprar ningún producto debido a la falta de stock'
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'Error en el servidor'
        });
    }
});