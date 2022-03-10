var express = require("express");
var routes = express.Router();
var salesPersonService = require("../service/sales-person-service");
var passport = require("passport");

routes.get(
  "/calculateTodaySale",
  passport.authenticate("jwt", {
    session: false,
  }),
  salesPersonService.calculateTodaySale
);

module.exports = routes;
