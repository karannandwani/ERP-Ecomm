var mongoose = require("mongoose");

var FeedbackImage = mongoose.Schema({
    image: { type: String },
    mimType: { type: String },
});

var OrderFeedbackSchema = mongoose.Schema({

    order: {
        type: mongoose.Types.ObjectId,
        ref: "Order",
        required: true,
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
    },
    facility: {
        type: mongoose.Types.ObjectId,
        ref: "Facility",
        required: true,
    },
    business: {
        type: mongoose.Types.ObjectId,
        ref: "Business",
        required: true,
    },
    rating: { type: Number, required: true },
    comment: { type: String },
    image: { type: [FeedbackImage] },
});

module.exports = mongoose.model("OrderFeedback", OrderFeedbackSchema);
