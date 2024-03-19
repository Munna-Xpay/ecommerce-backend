import mongoose from 'mongoose'

const sellerSchema = new mongoose.Schema({
    fullName: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phoneNum: {
        type: String,
        default: ""
    },
    address: {
        type: String,
        required: true
    },
    zipCode: {
        type: Number,
        default: ""
    },
    city: {
        type: String,
        default: ""
    },
    country: {
        type: String,
        required: true
    },
    company_name: {
        type: String,
        required: true
    },
    company_icon: {
        type: String,
        required: true
    },
    website: {
        type: String,
        required: true
    }
}, { timestamps: true })

const sellerModel = mongoose.model("sellers", sellerSchema)

export default sellerModel;