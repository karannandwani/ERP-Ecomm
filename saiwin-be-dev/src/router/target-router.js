var express = require("express");
var routes = express.Router();
var targetService = require("../service/target-service");
var passport = require("passport");

routes.post(
  "/",
  passport.authenticate("jwt", {
    session: false,
  }),
  targetService.createTarget
);

routes.get(
  "/",
  passport.authenticate("jwt", {
    session: false,
  }),
  targetService.targetFetchBySalesPerson
);
module.exports = routes;
