var mongoose = require("mongoose");

// var Condition = mongoose.Schema({
//   variable: { type: mongoose.Types.ObjectId, ref: "SchemeVariable" },
//   operator: { type: String, required: true },
//   value: { type: Object, required: true },
// });

var Scheme = mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ["PRODUCT_DISCOUNT", "COMBO_PRODUCT_DISCOUNT", "COMBO_PRODUCT_FREE"],
  },
  effectFrom: { type: Date, required: true, default: Date.now() },
  effectTill: { type: Date, required: true },
  active: { type: Boolean, required: true, default: true },
  autoApplied: { type: Boolean, required: true, default: false },
  business: { type: mongoose.Types.ObjectId, required: true, ref: "Business" },
  condition: { type: Object },
  effect: { type: Object },
  evaluation: { type: [Object] },
  product: { type: mongoose.Types.ObjectId },
});

module.exports = mongoose.model("Scheme", Scheme);
