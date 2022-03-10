var express = require("express");
var routes = express.Router();
var passport = require("passport");
const cartService = require("../service/cart-service");

routes.post(
  "/",
  passport.authenticate("jwt", {
    session: false,
  }),
  cartService.addToCart
);

routes.get(
  "/",
  passport.authenticate("jwt", {
    session: false,
  }),
  cartService.getCartByUser
);

routes.post(
  "/placeOrder",
  passport.authenticate("jwt", {
    session: false,
  }),
  cartService.placeOrder
);

routes.post(
  "/update",
  passport.authenticate("jwt", {
    session: false,
  }),
  cartService.updateCart
);

routes.post(
  "/coupon",
  passport.authenticate("jwt", {
    session: false,
  }),
  cartService.manageCouponForCart
);

module.exports = routes;
