var express = require("express");
var routes = express.Router();
var staticDataService = require("../service/static-data-service");
var passport = require("passport");

routes.post(
  "/",
  passport.authenticate("jwt", {
    session: false,
  }),
  staticDataService.createOrUpdate
);

routes.post(
  "/list",
  passport.authenticate("jwt", {
    session: false,
  }),
  staticDataService.fetch
);

routes.post("/key", staticDataService.fetchByKey);

module.exports = routes;
