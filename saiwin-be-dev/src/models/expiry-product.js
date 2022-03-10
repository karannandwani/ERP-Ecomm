var mongoose = require("mongoose");

var Products = mongoose.Schema({
  noOfCase: { type: Number },
  noOfProduct: { type: Number },
  costPrice: { type: Number, required: true },
  wholesalePrice: { type: Number },
  retailPrice: { type: Number, required: true },
  mrp: { type: Number },
  lotId: { type: String },
  qtyPerCase: { type: Number },
  expiryDate: { type: Date },
});

module.exports = mongoose.model("Products", Products);

var ExpiryProduct = mongoose.Schema({
  product: { type: mongoose.Types.ObjectId, ref: "Product", required: true },
  facility: { type: mongoose.Types.ObjectId, ref: "Facility" },
  products: { type: [Products], required: true },
  business: { type: String, required: true },
});

module.exports = mongoose.model("ExpiryProduct", ExpiryProduct);
