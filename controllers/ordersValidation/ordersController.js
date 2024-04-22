import Order from "../../models/ordersModel.js";
import Products from "../../models/productsModel.js";
import User from "../../models/userModel.js";
import mongoose from "mongoose";
import Razorpay from 'razorpay';
import crypto from 'crypto'
import { log } from "console";

//checkout details
export const orderDetails = async (req, res) => {
    const userId = new mongoose.Types.ObjectId(req.payload);
    console.log(req.body)
    try {
        const newOrder = new Order({ ...req.body, userId: req.payload })
        await newOrder.save()
        req.body.products.map(async (item) => {
            await Products.findByIdAndUpdate(item.product._id, { $set: { product_sold: item.product.product_sold + 1, stockQuantity: item.product.stockQuantity - 1 } })
            await User.findByIdAndUpdate(req.payload, { $inc: { ordersCount: +1 } })
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
        const orders = await Order.find().populate('userId')
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
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
        console.log(updatedOrder)
        await User.findByIdAndUpdate(req.payload, { $inc: { ordersCount: -1 } })
        updatedOrder.products.map(async (item) => {
            await Products.findByIdAndUpdate(item.product._id, { $inc: { product_sold: - 1, stockQuantity: + 1 } })
        })
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
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
        const userOrderDetails = await Order.aggregate([
            { $unwind: "$products" }
        ]);

        res.status(200).json(userOrderDetails);
    }
    catch (err) {
        res.status(401).json({ error: err, message: 'Orders details update failed' })
    }
}

//update order by seller
export const updateOrderBySeller = async (req, res) => {
    // console.log(req.params)
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
        // const userOrderDetails = await Order.aggregate([
        //     { $unwind: "$products" },
        //     {
        //         $match: { "products.product.seller._id": req.params.id }
        //     }
        // ]);

        res.status(200).json({ message: "Order status updated successfull" });
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
                    },
                    orderStatus: { $not: { $in: ['Canceled', 'Refunded'] } }
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
                    dateOrdered: {
                        $gte: new Date(new Date().getFullYear(), 0, 1), // Start of the current year
                        $lt: new Date(new Date().getFullYear() + 1, 0, 1) // Start of next year
                    },
                    orderStatus: { $not: { $in: ['Canceled', 'Refunded'] } }
                }
            },
            {
                $unwind: "$products"
            },
            {
                $project: {
                    month: { $month: "$dateOrdered" },
                    price: "$totalPrice",
                    sellerId: { $toObjectId: "$products.product.seller._id" }
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
                    totalPrice: 1,
                    orderStatus: 1
                }
            },
            {
                $match: {
                    month: new Date().getMonth() + 1,
                    orderStatus: { $not: { $in: ['Canceled', 'Refunded'] } }
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
                    sellerId: { $toObjectId: "$products.product.seller._id" }
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

//order by category
export const getOrderByCategory = async (req, res) => {
    let { categoryFilter, sort_option } = req.query;

    // Default category is "Electronics"
    let category = categoryFilter || "All";

    try {
        // Default sort option: name A-Z
        let sortValue = { 'createdAt': -1 };

        switch (sort_option) {
            case "latest":
                sortValue = { 'createdAt': -1 };
                break;
            case "A-Z":
                sortValue = { 'products.product.title': 1 };
                break;
            case "Z-A":
                sortValue = { 'products.product.title': -1 };
                break;
            case "rating_low_to_high":
                sortValue = { 'products.product.review_star': 1 };
                break;
            case "rating_high_to_low":
                sortValue = { 'products.product.review_star': -1 };
                break;
            default:
                break;
        }

        const userOrderDetails = await Order.aggregate([
            { $unwind: "$products" },
            { $match: category === "All" ? {} : { "products.product.category": category } }, // Match orders with specified category
            { $sort: sortValue }
        ]);

        res.status(200).json(userOrderDetails);
    } catch (err) {
        res.status(401).json({ error: err, message: 'Orders access failed' });
    }
};

//order by category by seller
export const getOrderByCategoryBySeller = async (req, res) => {
    let { categoryFilter, sort_option } = req.query;

    // Default category is "Electronics"
    let category = categoryFilter || "All";

    try {
        // Default sort option: name A-Z
        // let sortValue = { 'products.product.title': 1 };

        let sortValue = { 'createdAt': -1 };

        switch (sort_option) {
            case "latest":
                sortValue = { 'createdAt': -1 };
                break;
            case "A-Z":
                sortValue = { 'products.product.title': 1 };
                break;
            case "Z-A":
                sortValue = { 'products.product.title': -1 };
                break;
            case "rating_low_to_high":
                sortValue = { 'products.product.review_star': 1 };
                break;
            case "rating_high_to_low":
                sortValue = { 'products.product.review_star': -1 };
                break;
            default:
                break;
        }

        // switch (sort_option) {
        //     case "A-Z":
        //         sortValue = { 'products.product.title': 1 };
        //         break;
        //     case "Z-A":
        //         sortValue = { 'products.product.title': -1 };
        //         break;
        //     case "rating_low_to_high":
        //         sortValue = { 'products.product.review_star': 1 };
        //         break;
        //     case "rating_high_to_low":
        //         sortValue = { 'products.product.review_star': -1 };
        //         break;
        //     default:
        //         break;
        // }

        const userOrderDetails = await Order.aggregate([
            { $unwind: "$products" },
            { $match: category === "All" ? {} : { "products.product.category": category } }, // Match orders with specified category
            {
                $match: { "products.product.seller._id": req.params.id }
            },
            { $sort: sortValue },
        ]);

        res.status(200).json(userOrderDetails);
    } catch (err) {
        res.status(401).json({ error: err, message: 'Orders access failed' });
    }
};

// razorpay create order
export const razorpayCreateOrder = async (req, res) => {

    try {
        const razorpayInstance = new Razorpay({
            key_id: process.env.KEY_ID,
            key_secret: process.env.KEY_SECRET
        });

        const order = await razorpayInstance.orders.create({
            amount: req.body.amount,
            currency: 'INR', // Change currency if needed
            payment_capture: 1,
        });
        res.json(order);

    } catch (err) {
        res.status(401).json({ error: err, message: 'payment failed' });
    }
};


// razorpay payment cupture
export const razorpayPaymentCapture = async (req, res) => {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
    console.log(razorpay_signature);
    const body = razorpay_order_id + '|' + razorpay_payment_id;

    try {
        // Generate expected signature using the secret key
        const expectedSignature = crypto.createHmac('sha256', process.env.KEY_SECRET)
            .update(body)
            .digest('hex');

        // Verify the signature
        if (expectedSignature === razorpay_signature) {
            // Payment successful, update database or perform necessary actions
            res.json({ status: 'success', message: 'Payment successful' });
        } else {
            res.status(400).json({ status: 'error', message: 'Invalid signature' });
        }
    } catch (error) {
        console.error('Error capturing payment:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};



