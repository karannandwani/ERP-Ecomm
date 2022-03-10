var mongoose = require("mongoose");

var InventoryLedger = mongoose.Schema({
  id: { type: String, required: true },
  noOfCase: { type: Number },
  noOfProduct: { type: Number },
  orderId: { type: String },
  costPrice: { type: Number, required: true },
  wholesalePrice: { type: Number },
  retailPrice: { type: Number, required: true },
  mrp: { type: Number },
  lotId: { type: String },
  qtyPerCase: { type: Number },
  expiryDate: { type: Date },
  supplier: { type: mongoose.Types.ObjectId, ref: "Supplier" },
  barCode: { type: String },
  barcodeNo: { type: String },
});

module.exports = mongoose.model("LotProduct", InventoryLedger);

var InventorySchema = mongoose.Schema({
  product: { type: mongoose.Types.ObjectId, ref: "Product", required: true },
  facility: { type: mongoose.Types.ObjectId, ref: "Facility" },
  products: { type: [InventoryLedger], required: true },
  inTransit: { type: Number, default: 0 },
  type: { type: String },
  business: { type: String, required: true },
});

module.exports = mongoose.model("Inventory", InventorySchema);
