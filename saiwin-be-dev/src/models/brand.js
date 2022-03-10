var mongoose = require("mongoose");

/**
 * @typedef Brand
 * @property { String } name.required
 * @property { String } manufacturerId.required
 * @property { String } businessId.required
 */
var BrandSchema = mongoose.Schema({
  name: { type: String, required: true, trim: true },
  business: { type: String, required: true },
  manufacturer: {
    type: mongoose.Types.ObjectId,
    ref: "Manufacturer",
    required: true,
  },
  active: { type: Boolean, required: true, default: false },
});
BrandSchema.index({ name: 1, business: 1 }, { unique: true });

module.exports = mongoose.model("Brand", BrandSchema);
