import Joi from "joi";

const userSchema=Joi.object({
    email:Joi.string().email().required(),
    password:Joi.string().min(6).required(),
})

export const validateUserLoginRequest=(req,res,next)=>{
    userSchema.validateAsync(req.body).then(value=>{
        next()
    })
    .catch(error=>{
        res.status(401).json({error})
    })
}