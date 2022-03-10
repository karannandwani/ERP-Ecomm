var express = require("express");
var routes = express.Router();
var couponService = require("../service/coupon-service");
var passport = require("passport");
const accessService = require("../service/access-policy-service");

routes.post(
  "/",
  passport.authenticate("jwt", {
    session: false,
  }),
  accessService.checkPolicy("Coupon"),
  couponService.add
);
routes.post(
  "/list",
  passport.authenticate("jwt", {
    session: false,
  }),
  couponService.fetch
);

module.exports = routes;
