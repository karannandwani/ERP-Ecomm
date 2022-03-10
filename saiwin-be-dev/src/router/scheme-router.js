var express = require("express");
var routes = express.Router();
var schemeService = require("../service/scheme-service");
var passport = require("passport");

routes.post(
  "/",
  passport.authenticate("jwt", {
    session: false,
  }),
  schemeService.create
);

routes.get(
  "/",
  passport.authenticate("jwt", {
    session: false,
  }),
  schemeService.fetchScheme
);

routes.get(
  "/:schemeId",
  passport.authenticate("jwt", {
    session: false,
  }),
  schemeService.findById
);

module.exports = routes;
