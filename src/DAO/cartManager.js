import fs from 'fs';
import {
    ProductManager
} from './productManager.js';
import {
    routerCarts
} from '../routes/cart.router.js';

const productManager = new ProductManager();


export class CartManager {

    constructor() {
        this.pathCarts = "cart.json";
        this.pathProduct = "products.json";
        this.carts = [];
        const cartsString = JSON.stringify(this.carts)
        fs.writeFileSync(this.pathCarts, cartsString)
    }
    async getCart(idCart) {
        const fileCarts = await fs.promises.readFile(this.pathCarts, "utf-8");
        const fileCartsParse = JSON.parse(fileCarts);
        const findCart = fileCartsParse.find((cart) => cart.idCarrito == idCart);

        if (findCart) {
            return findCart
        } else {
            return false
        }
    }

    async createCart(cartId) {
        const newCart = {
            idCarrito: cartId,
            productos: [],
        }
        this.carts.push(newCart)
        let newCartsString = JSON.stringify(this.carts);
        await fs.promises.writeFile(this.pathCarts, newCartsString);
    }

    async addItemToCart(cartId, productId) {
        const fileCarts = await fs.promises.readFile(this.pathCarts, "utf-8")
        const fileCartsParse = JSON.parse(fileCarts);
        this.carts = fileCartsParse;

        const productIdToNumber = parseInt(productId)
        const cartIdToNumber = parseInt(cartId)

        const allProducts = await productManager.getProducts();
        const productFound = allProducts.find((product) => product.id == productIdToNumber);
        if (productFound) {
            let findCart = fileCartsParse.find((cart) => cart.idCarrito == cartIdToNumber);

            if (!findCart) {
                this.createCart(cartIdToNumber);
                findCart = fileCartsParse.find((cart) => cart.idCarrito == cartIdToNumber);
            }

            const foundProductInCart = findCart.productos.find((product) => product.idProduct === productIdToNumber);

            if (foundProductInCart) {
                foundProductInCart.quantity++;

                let cartsString = JSON.stringify(this.carts);
                await fs.promises.writeFile(this.pathCarts, cartsString);
                return true
            } else {
                const products = {
                    idProduct: productIdToNumber,
                    quantity: 1,
                }
                findCart.productos.push(products)
                let cartsString = JSON.stringify(this.carts);
                await fs.promises.writeFile(this.pathCarts, cartsString);
                return true
            }
        } else {
            return false
        }
    }
}