import Wishlist from "../../models/wishlistModel.js";

export const addToWishlist=async(req,res)=>{
    
    const userId=req.payload

    const {id,quantity,price}=req.body

    try{
        const existingProduct=await Wishlist.findOne({product:id,userId})
        if(existingProduct){
            res.status(400).json('Product already exists in wishlist!')
        }
        else{
            const newProduct=new Wishlist({
                product:id,userId,quantity,price
            })
            await newProduct.save()
            const allWishlistProducts=await Wishlist.find({userId}).populate('product')
            res.status(200).json(allWishlistProducts)
        }
    }
    catch(err){
        res.status(401).json({error:err,message:'Add to wishlist failed'})
    }

}

export const getWishlistProducts=async(req,res)=>{
    const userId=req.payload
    try{
        const wishlistProducts=await Wishlist.find({userId}).populate('product')
        if(wishlistProducts){
            res.status(200).json(wishlistProducts)
        }
    }
    catch(err){
        res.status(401).json({error:err,message:'Wishlist products access failed!'})
    }

}

//remove wishlist product
export const deleteWishlistProduct=async (req,res)=>{
    const {_id}=req.params
    try{
        const removedProduct=await Wishlist.findByIdAndDelete({_id})
        res.status(200).json(removedProduct)
    }
    catch(err){
        res.status(401).json(err)
    }
}