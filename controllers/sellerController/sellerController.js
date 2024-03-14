import Seller from '../../models/sellerModel.js';

//add seller
export const addSeller = async (req, res) => {
    console.log(req.file.filename)
    req.body.company_icon = req.file.filename
    try {
        const newSeller = new Seller(req.body);
        await newSeller.save();

        const IncomeStatOfSellersWithNewOne = await Seller.aggregate([
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: 'seller',
                    as: 'products'
                }
            },
            {
                "$unwind": { "path": "$products", "preserveNullAndEmptyArrays": true }
            },
            {
                $group: {
                    _id: { sellerId: '$_id', category: "$products.category" },
                    total_income: { $sum: { $multiply: ["$products.discounted_price", "$products.product_sold"] } },
                    total_orders: { $sum: "$products.product_sold" },
                    avg_rating: { $avg: "$products.review_star" }
                    // categories: { $push: { category: "$products.category", total_income: { $multiply: ["$products.product.product_sold", "$products.product.discounted_price"] } } }
                }
            },
            {
                $group: {
                    _id: "$_id.sellerId",
                    total_orders: { $sum: "$total_orders" },
                    total_income: { $sum: "$total_income" },
                    avg_rating: { $avg: "$avg_rating" },
                    categories: { $push: { category: "$_id.category", total_income: "$total_income" } },
                    // doc: { $push: "$$ROOT" }
                }
            },
            {
                $lookup: {
                    from: 'sellers',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'seller'
                }
            },
            {
                "$unwind": { "path": "$seller", "preserveNullAndEmptyArrays": true }
            },
            {
                $sort: { total_orders: -1 }
            }
        ]);

        res.status(200).json(IncomeStatOfSellersWithNewOne);
    } catch (err) {
        res.status(500).json(err)
    }
}

//get all seller or by query
export const getAllSeller = async (req, res) => {
    try {
        const sellers = await Seller.find();
        res.status(200).json(sellers);
    } catch (err) {
        res.status(500).json(err)
    }
}

//get one seller
export const getOneSeller = async (req, res) => {
    try {
        const seller = await Seller.findById(req.params.id);
        res.status(200).json(seller);
    } catch (err) {
        res.status(500).json(err)
    }
}

//update seller
export const updateSeller = async (req, res) => {
    req.body.company_icon = req.file.filename;
    try {
        const seller = await Seller.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.status(200).json(seller);
    } catch (err) {
        res.status(500).json(err)
    }
}

//delete seller
export const deleteSeller = async (req, res) => {
    try {
        const deletedSeller = await Seller.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Seller deleted successfully' });
    } catch (err) {
        res.status(500).json(err)
    }
}

//get income stat of a particular seller
export const getIncomeStatOfAParticularSeller = async (req, res) => {

    let sortBy = { total_orders: -1 };
    if (req.query.bestSelling) {
        sortBy.total_orders = -1
    } else if (req.query.highest_rating) {
        sortBy = { avg_rating: -1 }
    } else if (req.query.lowest_rating) {
        sortBy = { avg_rating: 1 }
    } else if (req.query.A_to_Z) {
        sortBy = { "seller.company_name": 1 }
    } else if (req.query.Z_to_A) {
        sortBy = { "seller.company_name": -1 }
    }

    try {
        const IncomeStatOfAParticularSeller = await Seller.aggregate([
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: 'seller',
                    as: 'products'
                }
            },
            {
                "$unwind": { "path": "$products", "preserveNullAndEmptyArrays": true }
            },
            {
                $group: {
                    _id: { sellerId: '$_id', category: "$products.category" },
                    total_income: { $sum: { $multiply: ["$products.discounted_price", "$products.product_sold"] } },
                    total_orders: { $sum: "$products.product_sold" },
                    avg_rating: { $avg: "$products.review_star" }
                    // categories: { $push: { category: "$products.category", total_income: { $multiply: ["$products.product.product_sold", "$products.product.discounted_price"] } } }
                }
            },
            {
                $group: {
                    _id: "$_id.sellerId",
                    total_orders: { $sum: "$total_orders" },
                    total_income: { $sum: "$total_income" },
                    avg_rating: { $avg: "$avg_rating" },
                    categories: { $push: { category: "$_id.category", total_income: "$total_income" } },
                    // doc: { $push: "$$ROOT" }
                }
            },
            {
                $lookup: {
                    from: 'sellers',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'seller'
                }
            },
            {
                "$unwind": { "path": "$seller", "preserveNullAndEmptyArrays": true }
            },
            {
                $sort: sortBy
            }
        ]);
        res.status(200).json(IncomeStatOfAParticularSeller);
    }
    catch (err) {
        res.status(401).json({ error: err, message: 'Failed to fetch data' })
    }
}

