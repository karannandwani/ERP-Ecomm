var mongoose = require("mongoose");

var LocationSchema = mongoose.Schema({
  type: { type: String, enum: ["Point"], required: true },
  coordinates: { type: [Number], required: true },
});

var GstSchema = mongoose.Schema({
  cgst: { type: Number, required: true },
  cgstValue: { type: Number, required: true },
  sgst: { type: Number, required: true },
  sgstValue: { type: Number, required: true },
});

var ProductLotTax = mongoose.Schema({
  type: { type: String },
  percent: { type: Number },
  amount: { type: Number },
});

var ProductLot = mongoose.Schema({
  id: { type: String, required: true },
  lotId: {
    type: mongoose.Types.ObjectId,
    ref: "InventoryLedger",
    required: true,
  },
  noOfProduct: { type: Number, required: true, default: 0 },
  noOfCase: { type: Number, required: true, default: 0 },
  costPrice: { type: Number },
  wholesalePrice: { type: Number },
  retailPrice: { type: Number },
  mrp: { type: Number },
  qtyPerCase: { type: Number },
  expiryDate: { type: Date },
  barcodeNo: { type: String },
  barCode: { type: String },
  scheme: {
    type: mongoose.Types.ObjectId,
    ref: "Scheme",
  },
  gst: { type: GstSchema },
  tax: { type: [ProductLotTax] },
});

var OrderProduct = mongoose.Schema({
  product: { type: mongoose.Types.ObjectId, ref: "Product", required: true },
  ordNoOfCase: { type: Number },
  ordNoOfProduct: { type: Number },
  acpNoOfCase: { type: Number },
  acpNoOfProduct: { type: Number },
  price: { type: Number },
  extraTax: {
    type: [
      {
        name: { type: String },
        amount: { type: Number },
        percentage: { type: Number },
      },
    ],
  },
  lots: { type: [ProductLot], required: true },
  comboProduct: { type: mongoose.Types.ObjectId, ref: "Product" },
});

var OrderScheme = mongoose.Schema({
  scheme: { type: Object, required: true },
  applied: { type: Boolean },
});

var OrderSchema = mongoose.Schema({
  id: { type: String, required: true },
  suppliers: { type: mongoose.Types.ObjectId, ref: "Supplier" },
  business: {
    type: mongoose.Types.ObjectId,
    ref: "Business",
    required: true,
  },
  facility: {
    type: mongoose.Types.ObjectId,
    ref: "Facility",
  },
  products: { type: [OrderProduct], required: true },
  status: { type: mongoose.Types.ObjectId, ref: "OrderStatus" },
  createdBy: { type: mongoose.Types.ObjectId, ref: "User" },
  subTotal: { type: Number },
  discount: { type: Number },
  type: { type: String },
  email: { type: String },
  password: { type: String },
  reason: { type: String },
  orderNo: { type: String, required: true },
  vehicle: { type: mongoose.Types.ObjectId, ref: "Vehicle" },
  schemes: { type: [OrderScheme] },
  area: { type: LocationSchema },
  address: { type: mongoose.Types.ObjectId, ref: "Address" },
  payment: { type: Object },
  expectedDeliveryBy: { type: Date },
  driver: { type: mongoose.Types.ObjectId, ref: "User" },
  feedback: { type: mongoose.Types.ObjectId, ref: "OrderFeedback" },
  beat: { type: mongoose.Types.ObjectId, ref: "Beat" },
  checkoutSubtotal: { type: Number },
});

module.exports = mongoose.model("Order", OrderSchema);
