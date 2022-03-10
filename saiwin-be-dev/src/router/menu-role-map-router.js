var express = require("express");
var routes = express.Router();
var passport = require("passport");
const accessService = require("../service/access-policy-service");
const menuRoleMapService = require("../service/menu-role-map-service");

routes.post(
  "/",
  passport.authenticate("jwt", {
    session: false,
  }),
  accessService.checkPolicy("Menu Role Map"),
  menuRoleMapService.add
);

routes.get(
  "/",
  passport.authenticate("jwt", {
    session: false,
  }),
  accessService.checkPolicy("Menu Role Map"),
  menuRoleMapService.fetchMenuitemRoles
);

routes.delete(
  "/delete/:menuId",
  passport.authenticate("jwt", {
    session: false,
  }),
  accessService.checkPolicy("Menu Role Map", "Delete"),
  menuRoleMapService.delete
);

module.exports = routes;
