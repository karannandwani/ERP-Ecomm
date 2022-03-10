var mongoose = require("mongoose");

var OrderProduct = mongoose.Schema({
  product: { type: mongoose.Types.ObjectId, ref: "Product", required: true },
  ordNoOfCase: { type: Number },
  ordNoOfProduct: { type: Number },
});

var OrderDraftSchema = mongoose.Schema({
  suppliers: { type: mongoose.Types.ObjectId, ref: "Supplier" },
  facility: { type: mongoose.Types.ObjectId, ref: "Facility" },
  products: { type: [OrderProduct], required: true },
});

module.exports = mongoose.model("OrderDraft", OrderDraftSchema);
