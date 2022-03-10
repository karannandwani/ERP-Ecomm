var mongoose = require("mongoose");

var BusinessSchema = mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  active: { type: Boolean, required: true, default: false },
  barcodeSequence: { type: String, default: "00000001" },
  country: { type: mongoose.Types.ObjectId, ref: "Country" },
  state: { type: mongoose.Types.ObjectId, ref: "State" },
  phone: { type: String },
  address: { type: String },
});

module.exports = mongoose.model("Business", BusinessSchema);
