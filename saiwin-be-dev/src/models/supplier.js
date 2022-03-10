const mongoose = require("mongoose");

var SupplierSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    // match: [
    //   /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    //   "Please enter a valid email",
    // ],
  },
  phone: {
    type: String,
    // match: [/\d{3}-\d{3}-\d{4}/, "Please enter a valid phone number!"],
  },
  facility: { type: mongoose.Types.ObjectId, ref: "Facility" },
  business: { type: mongoose.Types.ObjectId, ref: "Business" },
  shortName: { type: String, required: true },
  orderNo: { type: Number, required: true },
  country: { type: mongoose.Types.ObjectId, ref: "Country" },
  state: { type: mongoose.Types.ObjectId, ref: "State" },
});

module.exports = mongoose.model("Supplier", SupplierSchema);
