var mongoose = require("mongoose");

/**
 * @typedef MenuItem
 * @property { String } title.required
 * @property { String } url.required
 * @property { String } icon.required
 */
var MenuItemSchema = mongoose.Schema({
  title: { type: String, required: true, trim: true },
  url: { type: String, required: true, trim: true },
  icon: { type: String, required: true, trim: true },
  order: { type: Number, unique: true, required: true },
  parentId: { type: String },
});

// MenuItemSchema.index({ title: 1, businessId: 1 }, { unique: true });

module.exports = mongoose.model("MenuItem", MenuItemSchema);
