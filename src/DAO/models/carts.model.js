import {
    Schema,
    model
} from 'mongoose';

const cartSchema = new Schema({
/*    user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },*/
    products: {
        type: [{
            product: {
                type: Schema.Types.ObjectId,
                ref: 'products',
            },
            quantity: { type: Number, default: 1 }
        }, ],
        required: true,
    },
});

cartSchema.pre(["find", "findOne", "findById"], function () {
    this.populate("products.product");
});

export const CartModel = model('carts', cartSchema);