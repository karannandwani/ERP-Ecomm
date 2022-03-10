var mongoose = require("mongoose");

var Lot = mongoose.Schema({
  noOfCase: { type: Number },
  noOfProduct: { type: Number },
  orderNo: { type: String },
  orderId: { type: String },
  returnId: { type: String },
  costPrice: { type: Number, required: true },
  wholesalePrice: { type: Number },
  retailPrice: { type: Number, required: true },
  mrp: { type: Number },
  lotId: {
    type: mongoose.Types.ObjectId,
    ref: "InventoryLedger",
    required: true,
  },
  qtyPerCase: { type: Number },
  expiryDate: { type: Date },
  track: { type: String, required: true },
  price: { type: Number, required: true },
  supplier: { type: mongoose.Types.ObjectId, ref: "Supplier" },
  customer: { type: mongoose.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Lot", Lot);

var InventorySchema = mongoose.Schema({
  product: { type: mongoose.Types.ObjectId, ref: "Product", required: true },
  facility: { type: mongoose.Types.ObjectId, ref: "Facility" },
  products: { type: [Lot], required: true },
  business: { type: String, required: true },
});

module.exports = mongoose.model("InventoryLedger", InventorySchema);
