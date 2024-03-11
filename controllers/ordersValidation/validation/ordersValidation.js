import Joi from "joi";

const orderSchema = Joi.object({
    products: Joi.array().required(),
    address: Joi.string().required(),
    zipCode: Joi.number().integer().min(100000).max(999999).required(),
    city: Joi.string().required(),
    country: Joi.string().required(),
    totalPrice: Joi.number().required(),
    shippingMethod: Joi.string().required(),
})

export const validateOrderRequest = (req, res, next) => {
    orderSchema.validateAsync(req.body)
        .then(value => {
            next();
        })
        .catch(error => {
            res.status(501).json({ error });
        });
}