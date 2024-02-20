import Joi from "joi";


const categorySchema = Joi.object({
    type: Joi.string(),
    category: Joi.string().required(),
    category_icon: Joi.string().required(),
    selledBy: Joi.string()
})

export const validateCategoryRequest = (req, res, next) => {
    categorySchema.validateAsync(req.body)
        .then(value => {
            next();
        })
        .catch(error => {
            res.status(501).json({ error });
        });
}