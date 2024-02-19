
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
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    productId: {
        type: String,
        required: true
    }
})

const reviewModel = mongoose.model("reviews", reviewSchema);

export default reviewModel