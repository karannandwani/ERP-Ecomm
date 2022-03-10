var mongoose = require("mongoose");

var BillProduct = mongoose.Schema({
  productId: { type: String, required: true },
  noOfCase: { type: Number, required: true, default: 0 },
  noOfProduct: { type: Number, required: true, default: 0 },
});

var BillSchema = mongoose.Schema({
  name: { type: String, unique: true, required: true, trim: true },
  businessId: { type: String, required: true },
  facilityId: { type: String, required: true },
  products: { type: Object, required: true },
  email: { type: String, required: true },
});

module.exports = mongoose.model("Bill", BillSchema);
