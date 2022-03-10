var express = require("express");
var routes = express.Router();
var passport = require("passport");
var orderFeedbackService = require("../service/order-feedback-service");

routes.post(
  "/",
  passport.authenticate("jwt", {
    session: false,
  }),
  orderFeedbackService.create
);

routes.post(
  "/list",
  passport.authenticate("jwt", {
    session: false,
  }),
  orderFeedbackService.findFeedback
);

module.exports = routes;
