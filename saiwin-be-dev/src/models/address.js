var mongoose = require("mongoose");

var AddressSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String, required: true },
  alternativePhone: { type: String },
  street1: { type: String },
  street2: { type: String },
  city: { type: String },
  pincode: { type: String },
  state: { type: String },
  country: { type: String },
  default: { type: Boolean, default: false },
  user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  active: { type: Boolean, required: true, default: true },
});
module.exports = mongoose.model("Address", AddressSchema);
