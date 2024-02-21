import Order from "../../models/ordersModel.js";


//checkout details
export const orderDetails=async(req,res)=>{
    try{
        const newOrder=new Order({...req.body,userId:req.payload})
        await newOrder.save()
        res.status(200).json(newOrder)
      }
       
    catch(err){
        res.status(401).json({error:err,message:'Order checkout failed'})
    }
}

//user order details
export const userOrder=async (req,res)=>{
    const userId=req.payload
    try{
        const userOrderDetails=await Order.find({userId})
        if(userOrderDetails){
            res.status(200).json(userOrderDetails)
        }
        else{
            res.status(404).json("No orders yet")
        }
    }
    catch(err){
        res.status(401).json({error:err,message:'User order details access failed'})
    }
}

//all orders (admin)
export const allOrders=async (req,res)=>{
    try{
        const orders=await Order.find()
        if(orders){
            res.status(200).json(orders)
        }
        else{
            res.status(404).json('Orders empty')
        }
    }
    catch(err){
        res.status(401).json({error:err,message:'Orders details access failed'})
    }
} 