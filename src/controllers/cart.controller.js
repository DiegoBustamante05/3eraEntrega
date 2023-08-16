import { CartService } from "../services/carts.service.js";
const Service = new CartService();

class CartsController {
    async create(req,res) {
        try {
            const newCart = await Service.newCart();
            res.status(200).send({
                status: 'success',
                data: newCart,
            });
        } catch (error) {
            res.status(500).send({
                status: 'error',
                message: error.message,
            });
        }
    }

    async getById(req,res) {
        const cartId = req.params.cid;
        try {
            const cart = await Service.getCartById(cartId)
            return res.status(200).json({
                status: "success",
                msg: `cart: ${cartId}`,
                data: cart,
            })
        } catch (error) {
            return res.status(404).json({
                status: "error",
                msg: `cart: ${cartId}, not exist`,
                data: {},
            })
        }
    }

    async addToCart(req,res) {
        try {
            let cid = req.params.cid;
            let pid = req.params.pid;
            await Service.addProductToCart(cid, pid);
            res
                .status(200)
                .send({
                    status: "success",
                    data: "product added"
                });
        } catch (error) {
            res.status(404).send({
                status: "error",
                error: error.message
            });
        }
    }

    async clearCart(req,res) {
        try {
            const cid = req.params.cid;
            console.log(cid)
            const clear = await Service.clearCart(cid);
            res.status(200).json({
                status: 'success',
                data: clear,
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message,
            });
        }
    }

    //revisar
    async deleteProductById(req,res) {
        try {
            const cid = req.params.cid;
            const pid = req.params.pid;
            const productToDelete = await Service.deleteProductInCart(cid, pid)
            res.status(200).json({
                status: 'success',
                message: 'product deleted',
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message,
            });
        }
    }

    async updateProductQuantityInCart(req,res) {
        try {
            const cid = req.params.cid;
            const pid = req.params.pid;
            const quantity = req.body.quantity;
            const productUpdated = await Service.updateQuantity(cid, pid, quantity)
            res.status(200).json({
                status: 'success',
                message: `product updated`,
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message,
            });
        }
    }

    async updateProductsInCart(req,res) {
        try {
            const cid = req.params.cid;
            const products = req.body;
            console.log(products)
            await Service.updateCart(cid, products);
            res.status(200).json({
                    status: 'success',
                    message: `product updated`,
                });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message,
            });    
        }
    }
    
}

export const cartsController = new CartsController