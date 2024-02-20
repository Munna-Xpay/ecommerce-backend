
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    inStock: {
        type: Boolean,
        default: true
    },
    about: {
        type: String,
        required: true
    },
    discounted_price: {
        type: Number,
        required: true
    },
    original_price: {
        type: Number,
        required: true
    },
    memory: {
        type: Array,
    },
    colors: {
        type: Array,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    images: {
        type: Array,
        default: []
    },
    category: {
        type: Array,
        default: []
    },
    manufacturer: {
        type: String,
        required: true
    },
    warranty: {
        type: String,
        required: true
    },
    ships_from: {
        type: String,
        required: true
    },
    description: {
        type: Array,
        default: []
    },
    shipping: {
        type: String,
        default: "Free"
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "sellers",
        required: true
    }
})

const productModel = mongoose.model("products", productSchema);

export default productModel