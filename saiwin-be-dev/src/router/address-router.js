var express = require("express");
var routes = express.Router();
var addressService = require("../service/address-service");
var passport = require("passport");

routes.post(
  "/",
  passport.authenticate("jwt", {
    session: false,
  }),
  addressService.add
);

routes.get(
  "/",
  passport.authenticate("jwt", {
    session: false,
  }),
  addressService.fetch
);

routes.delete(
  "/:addressId",
  passport.authenticate("jwt", {
    session: false,
  }),
  addressService.deleteAddress
);

module.exports = routes;
