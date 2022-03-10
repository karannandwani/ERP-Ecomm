var express = require("express");
var routes = express.Router();
var passport = require("passport");
const accessService = require("../service/access-policy-service");

routes.get(
  "/",
  passport.authenticate("jwt", {
    session: false,
  }),
  accessService.actionList
);
module.exports = routes;
