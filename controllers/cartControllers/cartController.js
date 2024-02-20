import Cart from '../../models/cartModel.js'

//addtocart
export const addToCart=async(req,res)=>{
  
    //user id
    const userId=req.payload

    const {id,quantity,subtotal}=req.body

    try{
        const existingProduct=await Cart.findOne({product:id,userId})
        if(existingProduct){
            res.status(400).json("Product already exists in cart!")
        }
        else{
           const newProduct=new Cart({product:id,quantity,subtotal,userId}) 
           await newProduct.save()
           const allCartItems=await Cart.find().populate('product')
           res.status(200).json(allCartItems)
        }
    }
    catch(err){
        res.status(401).json(err)
    }
}

//all cart products
export const cartProducts=async(req,res)=>{
    const userId=req.payload
    try{
        const products=await Cart.find({userId})
        if(products){
            res.status(200).json(products)
        }
    }
    catch(err){
        res.status(401).json(err)
    }
}

//quantity increment
export const incrementCartQty=async(req,res)=>{
    const {_id}=req.params
    try{
        const existingProduct=await Cart.findOne({_id})
        if(existingProduct){
            existingProduct.quantity+=1
            existingProduct.subtotal=existingProduct.quantity*existingProduct.subtotal
            await existingProduct.save()
            res.status(200).json("Quantity incremented")
        }
        else{
            res.status(404).json("Product not found")
        }
    }
    catch (err) {
        res.status(401).json(err)
    }
}

//quantity decrement
export const decrementCartQty=async(req,res)=>{
    const {_id}=req.params
    try{
        const existingProduct=await Cart.findOne({_id})
        if(existingProduct){
            existingProduct.quantity-=1
            if(existingProduct.quantity==0){
                await Cart.deleteOne({_id})
                res.status(200).json("Product removed")
            }
            else{
                existingProduct.subtotal=existingProduct.quantity*existingProduct.subtotal
                await existingProduct.save()
                res.status(200).json("Quantity decremented")
            }
        }
        else{
            res.status(404).json("Product not found")
        }
    }
    catch (err) {
        res.status(401).json(err)
    }
}

//remove cart product
export const deleteCartProduct=async(req,res)=>{
    const {_id}=req.params
    try{
        const removedProduct=await Cart.findByIdAndDelete({_id})
        res.status(200).json(removedProduct)
    }
    catch (err) {
        res.status(401).json(err)
    }
}