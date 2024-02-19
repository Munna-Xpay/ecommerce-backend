import Seller from '../../models/sellerModel.js';

//add seller
export const addSeller = async (req, res) => {
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
