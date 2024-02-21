import Review from "../../models/reviewsModel.js";


//add review
export const addReview = async (req, res) => {
    try {
        const newReview = new Review(req.body);
        await newReview.save();
        res.status(200).json(newReview);
    } catch (err) {
        res.status(500).json(err)
    }
}

//get all review or by query
export const getAllReview = async (req, res) => {
    try {
        const review = await Review.find().populate("reviewFrom");
        res.status(200).json(review);
    } catch (err) {
        res.status(500).json(err)
    }
}

//get reviews by product
export const getOneReview = async (req, res) => {
    try {
        const review = await Review.findOne({ productId: req.params.productId }).populate("reviewFrom");
        res.status(200).json(review);
    } catch (err) {
        res.status(500).json(err)
    }
}

//update review
export const updateReview = async (req, res) => {
    try {
        const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(review);
    } catch (err) {
        res.status(500).json(err)
    }
}

//delete review
export const deleteReview = async (req, res) => {
    try {
        const deletedreview = await Review.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Seller deleted successfully' });
    } catch (err) {
        res.status(500).json(err)
    }
}
