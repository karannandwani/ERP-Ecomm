var mongoose = require("mongoose");

var AddressSchema = mongoose.Schema({
  line1: { type: String, required: true },
  city: { type: String, required: true },
  district: { type: String, required: true },
  state: { type: String, required: true },
  pinCode: { type: String, required: true },
});

var salesPersonsLocation = {
  lat: { type: String, required: true },
  lng: { type: String, required: true },
};

var Comments = {
  comment: { type: String, required: true },
  date: { type: Date, required: true },
  followUpDate: { type: Date, required: true },
  salesPersonLocation: { type: salesPersonsLocation, required: true },
};

var LeadSchema = mongoose.Schema({
  name: { type: String, required: true, trim: true },
  storeLocation: { type: Object },
  address: { type: AddressSchema },
  phone: { type: String },
  email: { type: String, required: true },
  storeLogo: { type: String },
  mimType: { type: String },
  status: { type: String },
  comments: { type: [Comments] },
  user: { type: mongoose.Types.ObjectId, ref: "User" },
  business: { type: String, required: true },
  assignTo: { type: mongoose.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Lead", LeadSchema);
