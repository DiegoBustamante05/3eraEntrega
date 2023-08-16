import {
    CartModel
} from '../DAO/models/carts.model.js';
import { ProductService } from './products.service.js';



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
}