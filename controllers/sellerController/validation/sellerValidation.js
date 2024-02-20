import Joi from "joi";


const sellerSchema = Joi.object({
    fullName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    phoneNum: Joi.string(),
    address: Joi.string(),
    zipCode: Joi.number(),
    city: Joi.string(),
    country: Joi.string(),
    company_name: Joi.string().required()
})

export const validateSellerRequest = (req, res, next) => {
    sellerSchema.validateAsync(req.body)
        .then(value => {
            next();
        })
        .catch(error => {
            res.status(501).json({ error });
        });
}