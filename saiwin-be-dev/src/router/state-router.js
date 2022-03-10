var express = require("express");
var routes = express.Router();
var stateService = require("../service/state-service");
var passport = require("passport");

routes.post(
  "/",
  passport.authenticate("jwt", {
    session: false,
  }),
  stateService.createOrUpdate
);

routes.get(
  "/",
  passport.authenticate("jwt", {
    session: false,
  }),
  stateService.fetch
);

module.exports = routes;
