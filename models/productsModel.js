
const mongoose = require('mongoose');

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
    price: {
        type: Number,
        required: true
    },
    original_price: {
        type: Number,
        required: true
    },
    review_stars: {
        type: Number,
        default: 0
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
        type: String,
        required: true
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
    reviews: {
        type: [
            {
                username: {
                    type: String,
                    required: true
                },
                date: {
                    type: Date,
                    required: true
                },
                review: {
                    type: String,
                    required: true
                },
                review_stars: {
                    type: Number,
                    default: 0
                },
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'users',
                    required: true
                }
            }
        ],
        default: []
    }
})

module.exports = mongoose.model("products", productSchema);