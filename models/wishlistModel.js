import mongoose from "mongoose";

const wishlistSchema=new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'products',
        required:true
    },
    original_price:{
       type:Number,
       required:true
    }

},{timestamps:true})
const Wishlist=mongoose.model('Wishlists',wishlistSchema)
export default Wishlist;