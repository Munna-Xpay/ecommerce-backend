import mongoose from "mongoose";

const cartSchema=new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product',
        required:true
    },
    quantity:{
        type:'Number',
        default:1,
        required:true
    },
    subtotal:{
        type:Number,
        required:true
    }

},{timestamps:true})
const Cart=mongoose.model('Carts',cartSchema)
export default Cart;