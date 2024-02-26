
import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
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
    reviewFrom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
        required: true
    }
}, { timestamps: true })

const reviewModel = mongoose.model("reviews", reviewSchema);

export default reviewModel