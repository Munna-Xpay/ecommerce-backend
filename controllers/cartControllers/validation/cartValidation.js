import Joi from "joi";

const cartSchema=Joi.object({
    product:Joi.string().required(),
    original_price:Joi.number().required(),
})

export const validateCartRequest=(req,res,next)=>{
    cartSchema.validateAsync(req.body).then(value=>{
        next()
    })
    .catch(error=>{
        res.status(401).json({error})
    })
}