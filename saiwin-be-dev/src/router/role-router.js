var express = require("express");
var routes = express.Router();
var roleService = require("../service/role-service");
var passport = require("passport");
const accessService = require("../service/access-policy-service");

routes.post(
  "/add",
  passport.authenticate("jwt", {
    session: false,
  }),
  accessService.checkPolicy("Role"),
  roleService.create
);

routes.get(
  "/",
  passport.authenticate("jwt", {
    session: false,
  }),
  roleService.fetchRoles
);

module.exports = routes;
