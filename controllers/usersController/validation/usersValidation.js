import Joi from "joi";

const userSchema=Joi.object({
    fullName:Joi.string().required(),
    email:Joi.string().email().required(),
    password:Joi.string().min(6).required(),
    phoneNum:Joi.number().max(10).min(10).pattern(/^\d+$/).required(),
    birthday:Joi.date().required(),
    gender:Joi.string().required(),
    address:Joi.string().required(),
    zipCode:Joi.number().max(6).min(6).required(),
    city:Joi.string().required(),
    country:Joi.string().required(),
    profileImage:Joi.string().required()

})

export const validateUserRequest=(req,res,next)=>{
    userSchema.validateAsync(req.body).then(value=>{
        next()
    })
    .catch(error=>{
        res.status(401).json({error})
    })
}