var express = require("express");
var routes = express.Router();
var hsnGstService = require("../service/hsn-service");
var passport = require("passport");

routes.post(
  "/",
  passport.authenticate("jwt", {
    session: false,
  }),
  hsnGstService.create
);

routes.get(
  "/",
  passport.authenticate("jwt", {
    session: false,
  }),
  hsnGstService.fetch
);

routes.post(
  "/list",
  passport.authenticate("jwt", {
    session: false,
  }),
  hsnGstService.fetchUpdated
);

module.exports = routes;
