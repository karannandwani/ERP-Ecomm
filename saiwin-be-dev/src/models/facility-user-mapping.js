var mongoose = require("mongoose");

var FacilityUserMapping = mongoose.Schema({
  facility: {
    type: mongoose.Types.ObjectId,
    ref: "Facility",
    required: true,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  business: { type: mongoose.Types.ObjectId, ref: "Business", required: true },
  selected: { type: Boolean, required: true, default: false },
});

module.exports = mongoose.model("FacilityUserMapping", FacilityUserMapping);
