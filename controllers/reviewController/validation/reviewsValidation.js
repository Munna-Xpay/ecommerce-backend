import Joi from "joi";


const reviewSchema = Joi.object({
    username: Joi.string().required(),
    date: Joi.date().required(),
    review: Joi.string().required(),
    review_stars: Joi.number(),
    reviewFrom: Joi.string().required(),
    productId: Joi.string().required()
})

export const validateReviewRequest = (req, res, next) => {
    reviewSchema.validateAsync(req.body)
        .then(value => {
            next();
        })
        .catch(error => {
            res.status(501).json({ error });
        });
}