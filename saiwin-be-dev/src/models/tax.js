const mongoose = require("mongoose");

var TaxSchema = mongoose.Schema({
  name: { type: String, required: true },
  percentage: { type: Number, required: true },
  hsn: { type: mongoose.Types.ObjectId, ref: "HSN" },
  business: { type: mongoose.Types.ObjectId, ref: "Business" },
});

module.exports = mongoose.model("Tax", TaxSchema);
