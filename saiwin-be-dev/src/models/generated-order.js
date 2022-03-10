var mongoose = require("mongoose");

var ProductDetail = mongoose.Schema({
  product: { type: mongoose.Types.ObjectId, ref: "Product", required: true },
  ordNoOfCase: { type: Number },
  ordNoOfProduct: { type: Number, required: true },
});

module.exports = mongoose.model("ProductDetail", ProductDetail);

var GeneratedOrder = mongoose.Schema({
  facility: { type: mongoose.Types.ObjectId, ref: "Facility" },
  suppliers: { type: mongoose.Types.ObjectId, ref: "Supplier" },
  business: { type: mongoose.Types.ObjectId, ref: "Business" },
  products: { type: [ProductDetail], required: true },
  createdAt: { type: Date, required: true, default: Date.now },
  rejectedByFacility: { type: Boolean },
  rejectedBySupplier: { type: Boolean },
  createdBy: { type: String }
});

GeneratedOrder.index({ createdAt: 1 }, { expireAfterSeconds: 7200 });
module.exports = mongoose.model("GeneratedOrder", GeneratedOrder);
