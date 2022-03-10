var mongoose = require("mongoose");

/**
 * @typedef Vehicle
 * @property { String } name.required
 * @property { String } model.required
 * @property { String } businessId.required
 */
var VehicleSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  business: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    required: true,
    default: false,
  },
  facility: {
    type: mongoose.Types.ObjectId,
    ref: "Facility",
    required: true,
  },
});

VehicleSchema.index(
  {
    name: 1,
    business: 1,
    facility: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model("Vehicle", VehicleSchema);
