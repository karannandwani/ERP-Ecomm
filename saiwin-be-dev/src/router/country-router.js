var express = require("express");
var routes = express.Router();
var countryService = require("../service/country-service");
var passport = require("passport");
const accessService = require("../service/access-policy-service");

routes.post(
  "/",
  passport.authenticate("jwt", {
    session: false,
  }),
  countryService.createOrUpdate
);

routes.get(
  "/",
  passport.authenticate("jwt", {
    session: false,
  }),
  countryService.fetch
);

module.exports = routes;
