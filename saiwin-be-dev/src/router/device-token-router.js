var express = require("express");
var routes = express.Router();
var deviceTokenService = require("../service/device-token-service");
var passport = require("passport");

routes.post(
  "/",
  passport.authenticate("jwt", {
    session: false,
  }),
  deviceTokenService.create
);

routes.delete("/", deviceTokenService.remove);

module.exports = routes;
