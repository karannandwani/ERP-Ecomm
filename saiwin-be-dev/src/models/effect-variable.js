const mongoose = require("mongoose");

var EffectVariable = mongoose.Schema({
  name: { type: String, required: true },
  parameter: { type: Object, required: true },
  business: { type: String, required: true },
});

module.exports = mongoose.model("EffectVariable", EffectVariable);
