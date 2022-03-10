var express = require("express");
var routes = express.Router();
var businessService = require("../service/business-service");
var passport = require("passport");
const accessService = require("../service/access-policy-service");

routes.post(
  "/",
  passport.authenticate("jwt", {
    session: false,
  }),
  // accessService.checkPolicy("Business"),
  businessService.create
);

routes.get(
  "/",
  passport.authenticate("jwt", {
    session: false,
  }),
  // accessService.checkPolicy("Business"),
  businessService.fetch
);

routes.post("/fetchByName", businessService.fetchBusinessByName);

module.exports = routes;
