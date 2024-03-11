
import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    category: {
        type: String,
        required: true
    },
    category_icon: {
        type: String,
        required: true
    },
    sub_categories: {
        type: Array,
        default: []
    },
    selledBy: {
        type: String,
        default: ""
    }
}, { timestamps: true })

const categoryModel = mongoose.model("categories", categorySchema);

export default categoryModel