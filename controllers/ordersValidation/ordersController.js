import Order from "../../models/ordersModel.js";
import Products from "../../models/productsModel.js";
import mongoose from "mongoose";


//checkout details
export const orderDetails = async (req, res) => {
    const userId = new mongoose.Types.ObjectId(req.payload);
    console.log(req.body)
    try {
        const newOrder = new Order({ ...req.body, userId: req.payload })
        await newOrder.save()
        req.body.products.map(async (item) => {
            await Products.findByIdAndUpdate(item.product._id, { $set: { product_sold: item.product.product_sold + 1,stockQuantity:item.product.stockQuantity-1 } })
        })
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


//Cancel order
export const cancelOrder = async (req, res) => {
    const userId = new mongoose.Types.ObjectId(req.payload);
    try {
        const orderToBeDeleting = await Order.findById(req.params.id)
        // console.log(orderToBeDeleting)
        if (orderToBeDeleting.products.length > 1) {
            orderToBeDeleting.products = orderToBeDeleting.products.filter((item) => item.product._id != req.body.productId)
            // console.log(orderToBeDeleting)
            await Order.findByIdAndUpdate(req.params.id, { $set: orderToBeDeleting })
        } else {
            // console.log(orderToBeDeleting)
            await Order.findByIdAndDelete(req.params.id)
        }
        const AllOrdersWithUpdation = await Order.aggregate([
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
        res.status(200).json(AllOrdersWithUpdation)
    }
    catch (err) {
        res.status(401).json({ error: err, message: 'Failed to cancel order' })
    }
}

//update order
export const updateOrder = async (req, res) => {
    try {
        await Order.findByIdAndUpdate(req.params.id, { $set: req.body })
        res.status(200).json({ message: "Updated successfully" })
    }
    catch (err) {
        res.status(401).json({ error: err, message: 'Orders details update failed' })
    }
}

//get Orders And Income Of This Year
export const getOrdersAndIncomeOfThisYear = async (req, res) => {
    try {
        const thisYearStat = await Order.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(new Date().getFullYear(), 0, 1), // Start of the current year
                        $lt: new Date(new Date().getFullYear() + 1, 0, 1) // Start of next year
                    }
                }
            },
            {
                $unwind: "$products"
            },
            {
                $project: {
                    month: { $month: "$dateOrdered" },
                    price: "$totalPrice"
                }
            },
            {
                $group: {
                    _id: "$month",
                    orderCount: { $sum: 1 },
                    monthlyIncome: { $sum: "$price" }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);
        res.status(200).json(thisYearStat);
    }
    catch (err) {
        res.status(401).json({ error: err, message: 'Failed to fetch data' })
    }
}

//get sales activity by seller
export const getSalesActivity = async (req, res) => {
    try {
        const thisYearStat = await Order.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(new Date().getFullYear(), 0, 1), // Start of the current year
                        $lt: new Date(new Date().getFullYear() + 1, 0, 1) // Start of next year
                    }
                }
            },
            {
                $unwind: "$products"
            },
            {
                $project: {
                    month: { $month: "$dateOrdered" },
                    price: "$totalPrice",
                    sellerId: { $toObjectId: "$products.product.seller" }
                }
            },
            {
                $lookup: {
                    from: 'sellers',
                    localField: 'sellerId',
                    foreignField: '_id',
                    as: 'seller'
                }
            },
            {
                $unwind: "$seller"
            },
            {
                $group: {
                    _id: { sellerId: "$seller._id", month: "$month" },
                    monthlyIncome: { $sum: "$price" }
                }
            },
            {
                $sort: { "_id.month": 1 }
            },
            {
                $group: {
                    _id: "$_id.sellerId",
                    monthlyStat: { $push: { month: "$_id.month", monthlyIncome: "$monthlyIncome" } }
                }
            }
        ]);
        res.status(200).json(thisYearStat);
    }
    catch (err) {
        res.status(401).json({ error: err, message: 'Failed to fetch data' })
    }
}

//get periodic sales revenue by seller
export const getPeriodSalesRevenue = async (req, res) => {
    try {
        const periodSalesRevenueBySeller = await Order.aggregate([
            {
                $project: {
                    month: { $month: "$dateOrdered" },
                    products: 1,
                    dateOrdered: 1,
                    totalPrice: 1
                }
            },
            {
                $match: {
                    month: new Date().getMonth() + 1
                }
            },
            {
                $unwind: "$products"
            },
            {
                $addFields: {
                    dateOnly: {
                        $dateToString: {
                            format: "%Y-%m-%d", // Specify the desired format (YYYY-MM-DD)
                            date: "$dateOrdered" // Replace with your actual date field
                        }
                    }
                }
            },
            {
                $project: {
                    date: "$dateOnly",
                    price: "$totalPrice",
                    sellerId: { $toObjectId: "$products.product.seller" }
                }
            },
            {
                $lookup: {
                    from: 'sellers',
                    localField: 'sellerId',
                    foreignField: '_id',
                    as: 'seller'
                }
            },
            {
                $unwind: "$seller"
            },
            {
                $group: {
                    _id: { sellerId: "$seller._id", date: "$date" },
                    dailyIncome: { $sum: "$price" }
                }
            },
            {
                $sort: { "_id.date": 1 }
            },
            {
                $group: {
                    _id: "$_id.sellerId",
                    dailyStat: { $push: { date: "$_id.date", dailyIncome: "$dailyIncome" } }
                    // doc: { $push: "$$ROOT" },
                }
            }
        ]);
        res.status(200).json(periodSalesRevenueBySeller);
    }
    catch (err) {
        res.status(401).json({ error: err, message: 'Failed to fetch data' })
    }
}

