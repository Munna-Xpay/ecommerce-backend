import Joi from "joi";


const productSchema = Joi.object({
    title: Joi.string().required(),
    inStock: Joi.boolean(),
    about: Joi.string().required(),
    discounted_price: Joi.number().required(),
    original_price: Joi.number().required(),
    memory: Joi.array().items(Joi.string()),
    colors: Joi.array().items(Joi.string()).required(),
    category: Joi.array().items(Joi.string()),
    manufacturer: Joi.string().required(),
    warranty: Joi.string().required(),
    ships_from: Joi.string().required(),
    description: Joi.array().items(Joi.string()),
    shipping: Joi.string(),
    seller: Joi.string().required(),
    tax: Joi.number()
})

const fileUploadSchema = Joi.object({
    thumbnail: Joi.array().required(),
    images: Joi.array()
})


export const validateProductRequest = (req, res, next) => {
    productSchema.validateAsync(req.body)
        .then(value => {
            fileUploadSchema.validateAsync(req.files)
                .then(val => next())
                .catch(err => res.status(501).json({ err }))
        })
        .catch(error => {
            res.status(501).json({ error });
        });
}