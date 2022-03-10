var mongoose = require("mongoose");

var ReturnProductLot = mongoose.Schema({
  id: { type: String },
  lotId: { type: String },
  noOfCase: { type: Number },
  noOfProduct: { type: Number },
  costPrice: { type: Number },
  wholesalePrice: { type: Number },
  retailPrice: { type: Number },
  qtyPerCase: { type: Number },
  mrp: { type: Number },
  expiryDate: { type: Date },
  track: { type: String },
  barcodeNo: { type: String },
  barCode: { type: String },
});

var ReturnProduct = mongoose.Schema({
  product: { type: mongoose.Types.ObjectId, ref: "Product", required: true },
  reqNoOfCase: { type: Number },
  reqNoOfProduct: { type: Number },
  acpNoOfCase: { type: Number },
  acpNoOfProduct: { type: Number },
  lotArray: { type: [ReturnProductLot] },
});

module.exports = mongoose.model("ReturnProduct", ReturnProduct);

/**
 * @typedef Return
 * @property { String } facilityId.required
 * @property { String } suppliersId.required
 * @property { String } productId.required
 * @property { Number } noOfCase.required
 * @property { Number } noOfProduct.required
 * @property { String } businessId.required
 */
var ReturnSchema = mongoose.Schema({
  facility: {
    type: mongoose.Types.ObjectId,
    ref: "Facility",
    required: true,
  },
  suppliers: {
    type: mongoose.Types.ObjectId,
    ref: "Supplier",
    required: true,
  },
  products: { type: [ReturnProduct], required: true },
  business: {
    type: mongoose.Types.ObjectId,
    ref: "Business",
    required: true,
  },
  draft: { type: Boolean, required: true, default: false },
  status: { type: mongoose.Types.ObjectId, ref: "OrderStatus" },
  createdBy: { type: String },
  subTotal: { type: Number, required: true },
  type: { type: String },
  password: { type: String },
  reason: { type: String },
  returnNo: { type: String },
  vehicle: { type: mongoose.Types.ObjectId, ref: "Vehicle" },
});

module.exports = mongoose.model("Return", ReturnSchema);
