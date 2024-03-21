
import mongoose from 'mongoose';

const notifySchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    userProPic: {
        type: String,
        default: ""
    },
    notifyMsg: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    response: {
        type: String,
        default: ""
    },
    item_id: {
        type: String,
        required: true
    }
}, { timestamps: true })

const notifyModel = mongoose.model("notifications", notifySchema);

export default notifyModel