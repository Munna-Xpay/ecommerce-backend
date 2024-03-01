
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    products: {
        type: Array,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    zipCode: {
        type: Number,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    orderStatus: {
        type: String,
        default: 'ordered'
    },
    totalPrice: {
        type: Number,
        required: true
    },
    shippingMethod: {
        type: String,
        required: true
    },
    dateOrdered: {
        type: Date,
        default: Date.now,
    }
}, { timestamps: true })

const Order = mongoose.model('Orders', orderSchema)
export default Order;