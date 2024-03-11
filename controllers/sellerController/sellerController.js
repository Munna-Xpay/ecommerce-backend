import Seller from '../../models/sellerModel.js';

//add seller
export const addSeller = async (req, res) => {
    // add validations before saving
    try {
        const newSeller = new Seller(req.body);
        await newSeller.save();
        res.status(200).json(newSeller);
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
    try {
        const seller = await Seller.findByIdAndUpdate(req.params.id, req.body, { new: true });
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

//get sellers with products
export const getSellersWithProducts = async (req, res) => {

    let sortBy = { total_sold: -1 };
    if (req.query.bestSelling) {
        sortBy.total_sold = -1
    } else if (req.query.highest_rating) {
        sortBy = { avg_rating: -1 }
    } else if (req.query.lowest_rating) {
        sortBy = { avg_rating: 1 }
    } else if (req.query.A_to_Z) {
        sortBy = { "seller.company_name": 1 }
    } else if (req.query.Z_to_A) {
        sortBy = { "seller.company_name": -1 }
    }
    // console.log(sortBy)
    try {
        const allSellers = await Seller.aggregate([
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: 'seller',
                    as: 'all_products'
                }
            },
            {
                "$unwind": { "path": "$all_products", "preserveNullAndEmptyArrays": true }
            },
            {
                $group: {
                    _id: "$_id",
                    total_sold: { $sum: '$all_products.product_sold' },
                    avg_rating: { $avg: '$all_products.review_star' },
                    // company: { $push: { company_name: '$company_name',company_icon:'$company_icon' } }
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
        ])
        res.status(200).json(allSellers);
    } catch (err) {
        res.status(500).json(err)
    }
}