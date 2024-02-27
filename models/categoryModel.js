
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
        type: String, // create as type object id from seller model
        default:""
    }
}, { timestamps: true })

const categoryModel = mongoose.model("categories", categorySchema);

export default categoryModel