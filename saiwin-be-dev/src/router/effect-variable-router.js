var express = require("express");
var routes = express.Router();
var effectVariableService = require("../service/effect-variable-service");
var passport = require("passport");

routes.post(
  "/",
  passport.authenticate("jwt", {
    session: false,
  }),
  effectVariableService.create
);

routes.get(
  "/",
  passport.authenticate("jwt", {
    session: false,
  }),
  effectVariableService.fetch
);

routes.get(
  "/:effectVariableId",
  passport.authenticate("jwt", {
    session: false,
  }),
  effectVariableService.findById
);

module.exports = routes;
