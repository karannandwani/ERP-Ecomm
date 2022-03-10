var mongoose = require("mongoose");

/**
 * @typedef MenuItemRoleMap
 * @property { String } menuId.required
 * @property { String } roleId.required
 * @property { String } businessId.required
 */
var MenuItemRoleMapSchema = mongoose.Schema({
  menu: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MenuItem",
    required: true,
  },
  roleId: { type: mongoose.Types.ObjectId, ref: "Role", required: true },
  businessId: {
    type: String,
    required: true,
  },
});

MenuItemRoleMapSchema.index(
  { menu: 1, roleId: 1, businessId: 1 },
  { unique: true }
);

module.exports = mongoose.model("MenuItemRoleMap", MenuItemRoleMapSchema);
