var mongoose = require("mongoose");

/**
 * @typedef PricelistGroup
 * @property { String } name.required
 * @property { String } businessId.required
 *
 */
var PricelistGroupSchema = mongoose.Schema({
  name: { type: String, required: true, trim: true },
  active: { type: Boolean, required: true },
  business: { type: String, required: true },
});

PricelistGroupSchema.index({ name: 1, business: 1 }, { unique: true });

module.exports = mongoose.model("PricelistGroup", PricelistGroupSchema);
