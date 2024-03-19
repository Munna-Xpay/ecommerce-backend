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


//get review stat
export const getReviewStat = async (req, res) => {
    let sortBy = { createdAt: -1 };
    if (req.query.recent) {
        sortBy.createdAt = -1
    } else if (req.query.oldest) {
        sortBy = { createdAt: 1 }
    } else if (req.query.lowest_rating) {
        sortBy = { review_stars: 1 }
    } else if (req.query.highest_rating) {
        sortBy = { review_stars: -1 }
    }

    try {
        const reviewStat = await Review.aggregate([
            {
                $group: {
                    _id: "$review_stars",
                    total_review: { $sum: 1 },
                    // docs: { $push: "$$ROOT" }
                },
            },
            {
                $project: {
                    rate: "$_id",
                    total_review: 1
                }
            },
            {
                $sort: { total_review: 1 }
            }
        ]);

        const avg_review = await Review.aggregate([
            {
                $group: {
                    _id: null,
                    avg_review: { $avg: "$review_stars" },
                },
            }
        ]);

        const all_reviews = await Review.find().populate("reviewFrom").sort(sortBy)

        res.status(200).json({ review_stat: reviewStat, all_reviews, avg_review: avg_review[0].avg_review });
    }
    catch (err) {
        res.status(401).json({ error: err, message: 'Failed to fetch seller review stat' })
    }
}

