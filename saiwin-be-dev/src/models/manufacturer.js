var mongoose = require("mongoose");

/**
 * @typedef Manufacturer
 * @property { String } name.required
 * @property { String } businessId.required
 */
var ManufacturerSchema = mongoose.Schema({
  name: { type: String, required: true, trim: true },
  active: { type: Boolean, required: true, default: false },
  business: { type: String, required: true },
  image: { type: Object },
});

ManufacturerSchema.index({ name: 1, business: 1 }, { unique: true });

module.exports = mongoose.model("Manufacturer", ManufacturerSchema);
