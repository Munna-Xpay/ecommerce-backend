import Joi from "joi";


const categorySchema = Joi.object({
    category: Joi.string().required(),
    category_icon: Joi.string().required(),
    sub_categories: Joi.array(),
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