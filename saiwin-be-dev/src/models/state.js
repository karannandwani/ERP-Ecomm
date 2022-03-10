const mongoose = require("mongoose");

var State = mongoose.Schema({
  name: { type: String, required: true },
  country: { type: mongoose.Types.ObjectId, ref: "Country", required: true },
  active: { type: Boolean, required: true, default: true },
});
State.index({ name: 1 }, { unique: true });

module.exports = mongoose.model("State", State);
