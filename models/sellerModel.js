import mongoose from 'mongoose'

const sellerSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
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
        type: Number
    },
    gender: {
        type: String
    },
    address: {
        type: String
    },
    zipCode: {
        type: Number
    },
    city: {
        type: String
    },
    country: {
        type: String
    },
    company_name: {
        type: String,
        required: true
    }
})

const sellerModel = mongoose.model("sellers", sellerSchema)

export default sellerModel;