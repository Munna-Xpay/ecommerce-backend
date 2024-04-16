import Joi from "joi";


const sellerSchema = Joi.object({
    fullName: Joi.string(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    phoneNum: Joi.string().required(),
    address: Joi.string().required(),
    zipCode: Joi.number(),
    city: Joi.string(),
    country: Joi.string().required(),
    company_name: Joi.string().required(),
    company_icon: Joi.object(),
    website: Joi.string().required()
})

const sellerLoginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
})

export const validateSellerRequest = (req, res, next) => {
    console.log(req.body)
    sellerSchema.validateAsync(req.body)
        .then(value => {
            next();
        })
        .catch(error => {
            res.status(501).json({ error });
        });
}

export const validateSellerLoginRequest = (req, res, next) => {
    sellerLoginSchema.validateAsync(req.body)
        .then(value => {
            next();
        })
        .catch(error => {
            res.status(501).json({ error });
        });
}