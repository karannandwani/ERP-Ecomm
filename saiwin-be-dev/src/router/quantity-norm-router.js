var express = require("express");
var routes = express.Router();
var quantityNormService = require("../service/quantity-norm-service");
var passport = require("passport");
const accessService = require("../service/access-policy-service");

routes.post(
  "/",
  passport.authenticate("jwt", {
    session: false,
  }),
  accessService.checkPolicy("Quantity Norm"),
  quantityNormService.add
);

routes.get(
  "/",
  passport.authenticate("jwt", {
    session: false,
  }),
  quantityNormService.fetchNorms
);

routes.delete(
  "/delete/:quantityNormId",
  passport.authenticate("jwt", {
    session: false,
  }),
  quantityNormService.delete
);

module.exports = routes;
