import Joi from "joi";


const productSchema = Joi.object({
    title: Joi.string().required(),
    inStock: Joi.boolean(),
    stock:Joi.string().required(),
    stockQuantity:Joi.number().required(),
    product_type:Joi.number().required(),
    about: Joi.string().required(),
    discounted_price: Joi.number().required(),
    original_price: Joi.number().required(),
    features: Joi.array().items(Joi.object({
        key: Joi.string().required(),
        value: Joi.string().required()
    })).required() ,
    category: Joi.string().required(),
    manufacturer: Joi.string().required(),
    warranty: Joi.string(),
    ships_from: Joi.string().required(),
    description: Joi.string().required(),
    shipping: Joi.string(),
    seller: Joi.string().required(),
    tax: Joi.number(),
    isActive: Joi.boolean(),
    isBanner: Joi.boolean(),
    isTodayOffer: Joi.boolean(),
    isFeaturedProduct: Joi.boolean(),
    isSpacialOffer: Joi.boolean(),
    isFeaturedBrand: Joi.boolean(),
    product_sold: Joi.number(),
    brand_icon: Joi.string(),
    review_start: Joi.number(),
    sub_category: Joi.string()
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