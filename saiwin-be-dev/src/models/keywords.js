var mongoose = require("mongoose");
var KeywordSchema = mongoose.Schema({

    business: {
        type: mongoose.Types.ObjectId,
        ref: "Business",
        required: true,
    },
    type: { type: String, required: true, enum: ["Category", "Manufacturer", "Brand", "Product"] },
    itemId: { type: String, required: true },
    itemName: { type: String, required: true }

});

module.exports = mongoose.model("Keyword", KeywordSchema);
