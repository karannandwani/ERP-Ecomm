var mongoose = require("mongoose");

/**
 * @typedef QuantityNorm
 * @property { String } businessId.required
 * @property { String } storeId.required
 */
var QuantityNormSchema = mongoose.Schema({
  business: {
    type: String,
    required: true,
  },
  facility: {
    type: String,
    ref: "Facility",
    required: true,
  },
  product: {
    type: mongoose.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  minOrdQty: {
    type: Number,
    required: true,
  },
  maxOrdQty: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("QuantityNorm", QuantityNormSchema);
