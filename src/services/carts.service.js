import {
    CartModel
} from '../DAO/models/carts.model.js';
import { ProductService } from './products.service.js';
import { TicketModel } from '../DAO/models/ticket.model.js';
import nodemailer from "nodemailer";
import generateTicketCode from './ticket.service.js';

const productsService = new ProductService();

export class CartService {
    constructor() {}

    // Crea carrito OK!!
    async newCart() {
        const newCart = await CartModel.create({
            products: []
        });
        return newCart;
    }


    //obtener carrito por id OK!!
    async getCartById(id) {
        const cart = await CartModel.findById(id);
        return cart;
    }

    //agregar producto al carrito OK!!
    async addProductToCart(cId, pId) {
        try {
            const productToAdd = await productsService.getById(pId);

            if (!productToAdd) {
                throw new Error("Product not found");
            }

            console.log(productToAdd._id);

            let cart = await CartModel.findOneAndUpdate({
                _id: cId,
                "products.product": productToAdd._id
            }, {
                $inc: {
                    "products.$.quantity": 1
                },
            });

            if (!cart) {
                cart = await CartModel.findByIdAndUpdate(cId, {
                    $push: {
                        products: {
                            product: productToAdd._id,
                            quantity: 1
                        }
                    },
                });
            }

            return cart;
        } catch (error) {
            throw new Error(error);
        }

    
    }


    //borrar todos los products  del carrito OK!!
    async clearCart(cid) {
        const cart = await CartModel.findById(cid);
        cart.products = [];
        await cart.save();
    }

    //actualizar carrito con nuevo array de productos
    async updateCart(cid, products) {
        const newArray = products.products.map((product => {
            return {
                product: product._id,
                quantity: product.quantity
            }
        }))
        const cart = await CartModel.findByIdAndUpdate(cid, { products: newArray });
    }

    //eliminar un producto del carrito OK!!
    async deleteProductInCart(cid, pid) {
        const cart = await CartModel.findById(cid);
        cart.products = cart.products.filter(product => product.product.id.toString() !== pid);
        await cart.save();
    }


    // actualizar cantidad OK!!
    async updateQuantity(cid, productId, quantity) {
        const cart = await CartModel.findById(cid);
        const product = cart.products.find(product => product.product.id.toString() === productId);
        if (product) {
            product.quantity = quantity;
            await cart.save();
        }
    }

    // Comprar Carrito
    async purchaseCart(cartId) {
        try {
            const cart = await CartModel.findById(cartId).populate('products.product');
    
            if (!cart) {
                return { success: false, message: 'Cart not found' };
            }
    
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
                        title: product.title,
                        quantity: productItem.quantity,
                    });
                    product.stock -= productItem.quantity;
                    await product.save();
                } else {
                    productsNotPurchased.push(productItem);
                }
            }
    
            if (purchasedProducts.length > 0) {
                const ticket = new TicketModel({
                    code: await generateTicketCode(),
                    purchase_datetime: new Date().toISOString(),
                    amount: totalPrice,
                    purchaser: '', // Acá va el usuario logueado, pero como no pide que se entreguen las vistas no lo hice.
                    purchasedProducts: purchasedProducts,
                });
    
                await ticket.save();
    
                cart.products = productsNotPurchased;
                await cart.save();
    
                const transporter = nodemailer.createTransport({
                    service: 'gmail', 
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS,
                    },
                });
        
                const mailOptions = {
                    from: `${process.env.EMAIL_USER}`, 
                    to: 'diegi.b58@gmail.com', 
                    subject: `purchase was successful`,
                    html: `
                        <h1>Thank you for shopping with us</h1>
                        <p>Ticket Code: ${ticket.code}</p>
                        <p>Total: ${ticket.amount}</p>
                        <p>Time: ${ticket.purchase_datetime}</p>
                        <p>Purchased products:</p>
                        <ul>
                            ${purchasedProducts
                                .map((product) => `<li>${product.title} - Quantity: ${product.quantity}</li>`)
                                .join('')}
                        </ul>
                    `,
                };
        
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
        
                return {
                    success: true,
                    ticket: ticket,
                    productsNotPurchasedIds: productsNotPurchased.map((item) => item.product._id),
                };
            } else {
                return { success: false, message: 'The chosen products are out of stock' };
            }
        } catch (error) {
            console.error(error);
            return { success: false, message: 'Server Error' };
        }
    }
}