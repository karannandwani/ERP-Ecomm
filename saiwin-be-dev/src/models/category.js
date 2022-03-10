var mongoose = require("mongoose");

/**
 * @typedef Category
 * @property { String } name.required
 * @property { String } description
 * @property { String } businessId.required
 *
 */
var CategorySchema = mongoose.Schema({
  name: { type: String, required: true, trim: true },
  active: { type: Boolean, required: true, default: false },
  business: { type: String, required: true },
  description: { type: String },
  notifyBeforeExpiry: { type: Number },
  parentCategory: {
    type: mongoose.Types.ObjectId,
    ref: "Category",
  },
  searchCategory: [{ type: String }],
  image: { type: Object },
  icon: { type: Object },
});

CategorySchema.index({ name: 1, business: 1 }, { unique: true });

module.exports = mongoose.model("Category", CategorySchema);
