var express = require("express");
var routes = express.Router();
var landingPageService = require("../service/landing-page-data-service");
var passport = require("passport");

routes.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  landingPageService.create
);

routes.post(
  "/list",
  passport.authenticate("jwt", { session: false }),
  landingPageService.fetchData
);

routes.post(
  "/list/ecom",
  passport.authenticate("jwt", { session: false }),
  landingPageService.fetchDataForEcom
);

module.exports = routes;
