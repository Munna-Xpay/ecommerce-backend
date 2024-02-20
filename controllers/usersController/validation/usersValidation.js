import Joi from "joi";

const userSchema=Joi.object({
    fullName:Joi.string().required(),
    email:Joi.string().email().required(),
    password:Joi.string().min(6).required(),
    phoneNum:Joi.string().length(10).pattern(/^\d+$/),
    birthday:Joi.date(),
    gender:Joi.string(),
    address:Joi.string(),
    zipCode:Joi.number().integer().min(100000).max(999999),
    city:Joi.string(),
    country:Joi.string(),
    profileImage:Joi.string()

})

export const validateUserRequest=(req,res,next)=>{
    userSchema.validateAsync(req.body).then(value=>{
        next()
    })
    .catch(error=>{
        res.status(401).json({error})
    })
}