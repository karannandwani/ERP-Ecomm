var mongoose = require("mongoose");

var SchemeVariable = mongoose.Schema({
  name: { type: String, required: true },
  query: { type: String, required: true },
  business: { type: String, required: true },
});

module.exports = mongoose.model("SchemeVariable", SchemeVariable);
