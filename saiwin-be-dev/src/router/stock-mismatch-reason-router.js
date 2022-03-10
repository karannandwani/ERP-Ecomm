var express = require("express");
var routes = express.Router();
var stockMismatchReasonService = require("../service/stock-mismatch-reason-service");
var passport = require("passport");

routes.post(
  "/",
  passport.authenticate("jwt", {
    session: false,
  }),
  stockMismatchReasonService.createOrUpdate
);

routes.get(
  "/",
  passport.authenticate("jwt", {
    session: false,
  }),
  stockMismatchReasonService.fetch
);

module.exports = routes;
