const mongoose = require("mongoose");

/**
 * @typedef Product
 * @property { String } name.required
 * @property { String } brandId
 * @property { String } sku
 * @property { String } basepackCode
 * @property { String } hsnNumber
 * @property { String } hsnDescription
 * @property { String } description
 * @property { String } categoryId
 * @property { String } subCategoryId
 * @property { String } priceListGroupId
 * @property { String } manufacturerId
 * @property { Number } qtyPerCase
 * @property { Number } mrp.required
 * @property { String } image
 * @property { String } mimType
 * @property { String } businessId.required
 */

var ProductImage = mongoose.Schema({
  image: { type: String },
  mimType: { type: String },
  featured: { type: Boolean, default: false },
});
var ProductSchema = mongoose.Schema({
  name: { type: String, required: true, trim: true },
  business: { type: String, required: true },
  brand: { type: mongoose.Types.ObjectId, ref: "Brand" },
  sku: { type: String },
  basepackCode: { type: String },
  hsn: { type: mongoose.Types.ObjectId, ref: "HSN" },
  description: { type: String },
  category: { type: mongoose.Types.ObjectId, ref: "Category" },
  priceListGroup: { type: mongoose.Types.ObjectId, ref: "PricelistGroup" },
  manufacturer: { type: mongoose.Types.ObjectId, ref: "Manufacturer" },
  qtyPerCase: { type: Number },
  notifyBeforeExpiry: { type: Number },
  image: { type: [ProductImage] },
  tax: [{ type: mongoose.Types.ObjectId, ref: "Tax" }],
  lowStockMark: { type: Number },
  returnable: { type: Boolean, default: true },
});

ProductSchema.index({ name: 1, business: 1 }, { unique: true });

module.exports = mongoose.model("Product", ProductSchema);
