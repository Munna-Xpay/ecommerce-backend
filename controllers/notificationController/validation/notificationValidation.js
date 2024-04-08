import Joi from "joi";


const notificationSchema = Joi.object({
    username: Joi.string().required(),
    userProPic: Joi.string(),
    notifyMsg: Joi.string().required(),
    type: Joi.string().required(),
    response: Joi.string(),
    item_id: Joi.string().required(),
    userId: Joi.string().required()
})

export const validateNotificationRequest = (req, res, next) => {
    notificationSchema.validateAsync(req.body)
        .then(value => {
            next();
        })
        .catch(error => {
            res.status(501).json({ error });
        });
}