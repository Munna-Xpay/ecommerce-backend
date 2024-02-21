import Joi from "joi";


const couponSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    expiresOn: Joi.date().required(),
    price_limit: Joi.number().required(),
    save_price: Joi.number().required()
})

export const validateCouponRequest = (req, res, next) => {
    couponSchema.validateAsync(req.body)
        .then(value => {
            next();
        })
        .catch(error => {
            res.status(501).json({ error });
        });
}