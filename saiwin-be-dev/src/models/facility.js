var mongoose = require("mongoose");

var BeatWithPriority = mongoose.Schema({
  area: { type: mongoose.Types.ObjectId, ref: "Beat", required: true },
  priority: { type: Number, required: true },
});
/**
 * @typedef Facility
 * @property { String } name.required
 * @property { String } address.required
 * @property { String } businessId.required
 */
var FacilitySchema = mongoose.Schema({
  name: { type: String, required: true },
  active: { type: Boolean, required: true, default: false },
  address: { type: String },
  business: { type: String, required: true },
  suppliers: [{ type: mongoose.Types.ObjectId, ref: "Supplier" }],
  areas: { type: [BeatWithPriority] },
  type: { type: String, required: true },
  supplierDoc: { type: mongoose.Types.ObjectId, ref: "Supplier" },
  shortName: { type: String, required: true },
  billNo: { type: Number, required: true },
  returnNo: { type: Number, required: true },
  country: { type: mongoose.Types.ObjectId, ref: "Country", required: true },
  state: { type: mongoose.Types.ObjectId, ref: "State", required: true },
});

module.exports = mongoose.model("Facility", FacilitySchema);
