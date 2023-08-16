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
import { UserModel } from '../DAO/models/users.model.js';
import {
    CartModel
} from '../DAO/models/carts.model.js';
import {
    ProductModel
} from '../DAO/models/products.model.js';
import {
    TicketModel
} from '../DAO/models/ticket.model.js';
import nodemailer from "nodemailer";
import generateTicketCode from '../services/ticket.service.js';
import { checkCartOwner } from '../middlewares/auth.js';
import dotenv from 'dotenv';

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
                code: await  generateTicketCode(), 
                purchase_datetime: new Date().toISOString(),
                amount: totalPrice,
                purchaser: "",//Aca va el req.user.email pera utilizar el email del usuario logueado. Como no pide que hagamos la vista y utilizamos postman, me es imposible obtener el email.
                purchasedProducts: purchasedProducts,
            });

            await ticket.save();

            // Actualizar los productos no comprados en el carrito
            cart.products = productsNotPurchased;
            await cart.save();

            const productsNotPurchasedIds = productsNotPurchased.map(item => item.product._id);

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'process.env.EMAIL_USER', 
                    pass: 'process.env.EMAIL_PASS'
                }
            });

            const mailOptions = {
                from: 'process.env.EMAIL_USER',
                to: "diegi.b58@gmail.com", //Aca va el req.user.email pera utilizar el email del usuario logueado. Como no pide que hagamos la vista y utilizamos postman, me es imposible obtener el email.
                subject: `Venta`,
                html: `
                    <h1>Thanks for your purchase</h1>
                    <p>¡Gracias por tu compra!</p>
                    <p>Ticket Code: ${ticket.code}</p>
                    <p>Total: ${ticket.amount}</p>
                    <p>Time: ${ticket.purchase_datetime}</p>
                    <p>Purchased products:</p>
                    <ul>
                        ${purchasedProducts.map(product => `<li>${product.title} - Quantity: ${product.quantity}</li>`).join('')}
                    </ul>
                `
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });

            return res.json({
                message: 'successful',
                ticket: ticket,
                data: "products out of stock: " + productsNotPurchasedIds
            });
        } else {
            return res.status(400).json({
                error: 'the chosen products are out of stock'
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'Server Error'
        });
    }
});