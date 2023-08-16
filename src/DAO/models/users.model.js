import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const schema = new Schema({
    firstName: {
        type: String,
        max: 100,
    },
    lastName: {
        type: String,
        max: 100,
    },
    password: {
        type: String,
        max: 100,
    },
    email: {
        type: String,
        required: true,
        max: 100,
        unique: true,
    },
    role: {
        type: String,
        default: 'user',
    },
    age: {
        type: Number,
    },
    cart: {
        type: Schema.Types.ObjectId,
        ref: "carts",
        required: false,
        max: 100,
    },
});

schema.plugin(mongoosePaginate);
export const UserModel = model('users', schema);