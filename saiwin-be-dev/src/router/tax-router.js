var express = require("express");
var routes = express.Router();
var taxService = require("../service/tax-service");
var passport = require("passport");

routes.post(
  "/",
  passport.authenticate("jwt", {
    session: false,
  }),
  taxService.create
);

routes.get(
  "/",
  passport.authenticate("jwt", {
    session: false,
  }),
  taxService.fetch
);

routes.post(
  "/list",
  passport.authenticate("jwt", {
    session: false,
  }),
  taxService.fetchUpdated
);
module.exports = routes;
