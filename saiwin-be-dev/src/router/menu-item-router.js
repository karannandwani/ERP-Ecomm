var express = require("express");
var routes = express.Router();
var menuItemService = require("../service/menu-item-service");
var passport = require("passport");
const accessService = require("../service/access-policy-service");

routes.post(
  "/",
  passport.authenticate("jwt", {
    session: false,
  }),
  accessService.checkPolicy("Menu Item"),
  menuItemService.add
);

routes.post(
  "/delete/:menuId",
  passport.authenticate("jwt", {
    session: false,
  }),
  accessService.checkPolicy("Menu Item", "Delete"),
  menuItemService.delete
);

routes.get(
  "/",
  passport.authenticate("jwt", {
    session: false,
  }),
  menuItemService.fetchMenuItems
);

module.exports = routes;
