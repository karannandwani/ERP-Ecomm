var express = require("express");
var routes = express.Router();
var schemeVariableService = require("../service/scheme-variable-service");
var passport = require("passport");

routes.post(
  "/",
  passport.authenticate("jwt", {
    session: false,
  }),
  schemeVariableService.create
);

routes.get(
  "/",
  passport.authenticate("jwt", {
    session: false,
  }),
  schemeVariableService.fetch
);

routes.get(
  "/:schemeVariableId",
  passport.authenticate("jwt", {
    session: false,
  }),
  schemeVariableService.findById
);

module.exports = routes;
