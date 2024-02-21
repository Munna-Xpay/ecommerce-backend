import Coupon from "../../models/coupenModel.js";


//add Coupon
export const addCoupon = async (req, res) => {
    try {
        const newCoupon = new Coupon(req.body);
        await newCoupon.save();
        res.status(200).json(newCoupon);
    } catch (err) {
        res.status(500).json({ error: err })
    }
}

//get all Coupon 
export const getAllCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.find();
        res.status(200).json(coupon);
    } catch (err) {
        res.status(500).json(err)
    }
}

//get available Coupons
export const getAvaialableCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find({ expiresOn: { $gte: new Date() }, price_limit: { $lte: req.params.amount } });
        res.status(200).json(coupons);
    } catch (err) {
        res.status(500).json(err)
    }
}

//update Coupon
export const updateCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(coupon);
    } catch (err) {
        res.status(500).json(err)
    }
}

//delete Coupon
export const deleteCoupon = async (req, res) => {
    try {
        const deletedCoupon = await Coupon.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Seller deleted successfully' });
    } catch (err) {
        res.status(500).json(err)
    }
}
