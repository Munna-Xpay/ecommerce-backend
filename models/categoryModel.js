
import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    type: {
        type: String,
        default:''
    },
    category: {
        type: String,
        required: true
    },
    category_icon: {
        type: String,
        required: true
    },
    selledBy: {
        type: String,
        default:""
    }
})

const categoryModel = mongoose.model("categories", categorySchema);

export default categoryModel