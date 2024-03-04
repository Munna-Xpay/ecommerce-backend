import Order from "../../models/ordersModel.js";
import mongoose from "mongoose";


//checkout details
export const orderDetails = async (req, res) => {
    const userId = new mongoose.Types.ObjectId(req.payload);
    try {
        const newOrder = new Order({ ...req.body, userId: req.payload })
        await newOrder.save()
        const AllOrdersWithNewOne = await Order.aggregate([
            {
                $match: {
                    userId: userId
                }
            },
            {
                $unwind: "$products"
            },
            {
                $sort: {
                    createdAt: -1
                }
            }
        ])
        res.status(200).json(AllOrdersWithNewOne)
    }

    catch (err) {
        res.status(401).json({ error: err, message: 'Order checkout failed' })
    }
}


//user order details
export const userOrder = async (req, res) => {
    const userId = new mongoose.Types.ObjectId(req.payload);
    console.log(userId)
    try {
        const userOrderDetails = await Order.aggregate([
            {
                $match: {
                    userId: userId
                }
            },
            {
                $unwind: "$products"
            },
            {
                $sort: {
                    createdAt: -1
                }
            }
        ])
        res.status(200).json(userOrderDetails)
    }
    catch (err) {
        res.status(401).json({ error: err, message: 'User order details access failed' })
    }
}

//all orders (admin)
export const allOrders = async (req, res) => {
    try {
        const orders = await Order.find()
        if (orders) {
            res.status(200).json(orders)
        }
        else {
            res.status(404).json('Orders empty')
        }
    }
    catch (err) {
        res.status(401).json({ error: err, message: 'Orders details access failed' })
    }
}

//delete order
export const deleteOrder = async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: "Order deleted successfully" })
    }
    catch (err) {
        res.status(401).json({ error: err, message: 'Orders details delete failed' })
    }
} 