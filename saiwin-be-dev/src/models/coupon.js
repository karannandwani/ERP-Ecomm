const mongoose = require("mongoose");

var Coupon = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  validFrom: { type: Date, required: true, default: Date.now() },
  validTill: { type: Date },
  active: { type: Boolean, required: true, default: false },
  discountType: { type: String, required: true, enum: ["Percentage", "Flat"] },
  discountAmount: { type: Number, required: true },
  minCartValue: { type: Number },
  ceilingValue: { type: Number },
  business: { type: String },
});

module.exports = mongoose.model("Coupon", Coupon);
