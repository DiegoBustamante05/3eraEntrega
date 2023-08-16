import { Schema, model } from "mongoose";


const schema = new Schema({
    purchasedProducts: { type: Array, required: true, max: 100 },
    code: { type: String, required: true, max: 100 },
    purchase_datetime: { type: String, required: true, max: 100, index: true },
    amount: { type: Number, required: true},
    purchaser: { type: String, required: false, max: 100 },
});

export const TicketModel = model('tickets', schema);