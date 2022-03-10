var express = require("express");
var routes = express.Router();
var notificationService = require("../service/notification-service");
var passport = require("passport");

routes.get(
  "/",
  passport.authenticate("jwt", {
    session: false,
  }),
  notificationService.fetch
);

module.exports = routes;
