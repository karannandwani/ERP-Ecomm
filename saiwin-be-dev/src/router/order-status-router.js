var express = require("express");
var routes = express.Router();
var orderStatusService = require("../service/order-status-service");
var passport = require("passport");

routes.post(
  "/",
  passport.authenticate("jwt", {
    session: false,
  }),
  orderStatusService.create
);

routes.get(
  "/",
  passport.authenticate("jwt", {
    session: false,
  }),
  orderStatusService.fetchStatus
);

module.exports = routes;
