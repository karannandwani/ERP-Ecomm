const mongoose = require("mongoose");

var LocationSchema = mongoose.Schema({
  type: { type: String, enum: ["Point"], required: true },
  coordinates: { type: [Number], required: true },
});

var TaxSchema = mongoose.Schema({
  type: { type: String },
  percent: { type: Number },
  amount: { type: Number },
});

var CartItem = mongoose.Schema({
  product: { type: mongoose.Types.ObjectId, ref: "Product", required: true },
  ordNoOfCase: { type: Number },
  ordNoOfProduct: { type: Number },
  price: { type: Number, required: true },
  productPrice: { type: Number, required: true },
  tax: { type: [TaxSchema] },
  comboProduct: { type: String },
});

var CouponDiscount = mongoose.Schema({
  coupon: { type: mongoose.Types.ObjectId, ref: "Coupon", required: true },
  discount: { type: Number, required: true },
});

var PaymentInfo = mongoose.Schema({
  type: { type: String },
  razorPayOrderId: { type: String },
  razorPayPaymentId: { type: String },
  razorPaySignature: { type: String },
});
var CartSchema = mongoose.Schema({
  business: {
    type: mongoose.Types.ObjectId,
    ref: "Business",
    required: true,
  },
  user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  area: { type: LocationSchema, required: true },
  facility: { type: mongoose.Types.ObjectId, ref: "Facility", required: true },
  products: { type: [CartItem], required: true },
  subTotal: { type: Number, required: true },
  couponDiscount: { type: CouponDiscount },
  discount: { type: Number },
  address: { type: mongoose.Types.ObjectId, ref: "Address" },
  payment: { type: PaymentInfo },
  priceBeforeDiscount: { type: Number },
  beat: { type: mongoose.Types.ObjectId, ref: "Beat", required: true },
});

module.exports = mongoose.model("Cart", CartSchema);
