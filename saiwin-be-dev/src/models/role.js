var mongoose = require("mongoose");

/**
 * @typedef Role
 * @property { String } name.required
 */
var RoleSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true, trim: true },
  businessId: {
    type: mongoose.Types.ObjectId,
    ref: "Business",
  },
});

module.exports = mongoose.model("Role", RoleSchema);
