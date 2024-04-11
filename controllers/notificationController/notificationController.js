import Notify from "../../models/notificationsModel.js";


//add notification
export const addNotification = async (req, res) => {
    try {
        const newNotify = new Notify(req.body);
        await newNotify.save();
        res.status(200).json(newNotify);
    } catch (err) {
        res.status(500).json(err);
    }
}

//get all notifications
export const getAllNotification = async (req, res) => {
    try {
        const notifications = await Notify.find().sort({ createdAt: -1 })
        res.status(200).json(notifications);
    } catch (err) {
        res.status(500).json(err)
    }
}

//get reponse notifications
export const getResponseNotification = async (req, res) => {
    try {
        const notifications = await Notify.find({ userId: req.params.id }).sort({ updatedAt: -1 })
        res.status(200).json(notifications);
    } catch (err) {
        res.status(500).json(err)
    }
}

//update notification
export const updateNotification = async (req, res) => {
    try {
        const notification = await Notify.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        const all_notifications = await Notify.find().sort({ createdAt: -1 })
        res.status(200).json(all_notifications);
    } catch (err) {
        res.status(500).json(err)
    }
}

// //delete review
export const deleteReview = async (req, res) => {
    try {
        const deletedreview = await Review.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'review deleted successfully' });
    } catch (err) {
        res.status(500).json(err)
    }
}

