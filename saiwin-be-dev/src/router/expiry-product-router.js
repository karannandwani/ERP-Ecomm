var express = require("express");
var routes = express.Router();
var expiryProductService = require("../service/expiry-product-service");
var passport = require("passport");

routes.get(
  "/count",
  passport.authenticate("jwt", {
    session: false,
  }),
  expiryProductService.expiryProductCount
);

routes.get(
  "/",
  passport.authenticate("jwt", {
    session: false,
  }),
  expiryProductService.fetchExpiryProduct
);

routes.post(
  "/",
  passport.authenticate("jwt", {
    session: false,
  }),
  expiryProductService.fetchExpiryProductNew
);

module.exports = routes;
