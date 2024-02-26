import Review from "../../models/reviewsModel.js";
import Product from "../../models/productsModel.js";


//add review
export const addReview = async (req, res) => {
    try {
        const newReview = new Review(req.body);
        await newReview.save();
        const productReviews = await Review.find({ productId: req.body.productId });
        const reviewStar = productReviews.length > 0 && productReviews.map(rev => rev?.review_stars).reduce((a, b) => a + b) / productReviews.length;
        // console.log(reviewStar)
        const updatedProduct = await Product.findByIdAndUpdate(req.body.productId, { $set: { review_star: reviewStar } }, { new: true })
        // console.log(updatedProduct)
        const newReviewResponse = await Review.findById(newReview._id).populate("reviewFrom")
        res.status(200).json(newReviewResponse);
    } catch (err) {
        res.status(500).json(err)
    }
}

//get all review or by query
export const getAllReview = async (req, res) => {
    try {
        const review = await Review.find().populate("reviewFrom")
        res.status(200).json(review);
    } catch (err) {
        res.status(500).json(err)
    }
}

//get reviews by product
export const getOneReview = async (req, res) => {
    try {
        const review = await Review.find({ productId: req.params.productId }).populate("reviewFrom").populate("productId");
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
        res.status(200).json({ message: 'review deleted successfully' });
    } catch (err) {
        res.status(500).json(err)
    }
}
