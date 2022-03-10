var mongoose = require("mongoose");

var productobj = mongoose.Schema({
    product: { type: mongoose.Types.ObjectId, ref: "Product" },
    ordNoOfProduct: { type: Number },
    ordNoOfCase: { type: Number },
    lotArray: { type: Array },
});

var DraftBillSchema = mongoose.Schema({
    business: {
        type: mongoose.Types.ObjectId,
        ref: "Business",
    },
    suppliers: { type: mongoose.Types.ObjectId, ref: "Facility" },
    products: { type: [productobj] },
    email: { type: String },
    createdAt : {type: Date, default: Date.now, expires: 18000}
});
module.exports = mongoose.model("DraftBill", DraftBillSchema);