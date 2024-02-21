
import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    expiresOn: {
        type: Date,
        required: true
    },
    price_limit: {
        type: Number,
        required: true
    },
    save_price: {
        type: Number,
        required: true
    }
}, { timestamps: true })

const coupenModel = mongoose.model("coupons", couponSchema);

export default coupenModel