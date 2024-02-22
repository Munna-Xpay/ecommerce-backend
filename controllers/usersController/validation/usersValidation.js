import Joi from "joi";

const userSchema=Joi.object({
    fullName:Joi.string().required(),
    email:Joi.string().email().required(),
    password:Joi.string().min(6).required(),

})

export const validateUserRegisterRequest=(req,res,next)=>{
    userSchema.validateAsync(req.body).then(value=>{
        next()
    })
    .catch(error=>{
        res.status(401).json({error})
    })
}

