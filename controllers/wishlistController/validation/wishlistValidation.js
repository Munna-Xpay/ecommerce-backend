import Joi from "joi";

const wishlistSchema=Joi.object({
    userId:Joi.string().required(),
    product:Joi.string().required(),
    original_price:Joi.number().required(),
})

export const validateWishlistRequest=(req,res,next)=>{
   wishlistSchema.validateAsync(req.body).then(value=>{
        next()
    })
    .catch(error=>{
        res.status(401).json({error})
    })
}