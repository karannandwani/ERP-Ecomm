var mongoose = require("mongoose");

/**
 * @typedef AccessPolicy
 * @property { String } role.required
 * @property { String } action.required
 * @property { String } resource.required
 * @property { String } businessId.required
 */
var AccessPolicySchema = mongoose.Schema({
  roleId: { type: String, required: true },
  action: { type: String, required: true },
  resource: { type: String, required: true },
  businessId: { type: String, required: true },
});

AccessPolicySchema.index(
  { roleId: 1, action: 1, resource: 1, businessId: 1 },
  { unique: true }
);
module.exports = mongoose.model("AccessPolicy", AccessPolicySchema);
