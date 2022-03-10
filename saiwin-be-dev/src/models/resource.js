var mongoose = require("mongoose");

/**
 * @typedef Resource
 * @property { String } name.required
 */
var ResourceSchema = mongoose.Schema({
  name: { type: String, required: true },
});

module.exports = mongoose.model("Resource", ResourceSchema);