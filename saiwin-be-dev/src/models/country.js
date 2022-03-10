const mongoose = require("mongoose");

var Country = mongoose.Schema({
  name: { type: String, required: true },
  active: { type: Boolean, required: true, default: true },
});

Country.index({ name: 1 }, { unique: true });
module.exports = mongoose.model("Country", Country);
