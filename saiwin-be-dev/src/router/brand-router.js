var express = require("express");
var routes = express.Router();
var brandService = require("../service/brand-service");
var passport = require("passport");
const accessService = require("../service/access-policy-service");

routes.post(
  "/",
  passport.authenticate("jwt", {
    session: false,
  }),
  accessService.checkPolicy("Brand"),
  brandService.create
);

routes.get(
  "/",
  passport.authenticate("jwt", {
    session: false,
  }),
  brandService.findBrands
);

routes.get(
  "/status/:brandId/:status",
  passport.authenticate("jwt", {
    session: false,
  }),
  accessService.checkPolicy("Brand"),
  brandService.changeBrandStatus
);

routes.get(
  "/findById/:brandId",
  passport.authenticate("jwt", {
    session: false,
  }),
  accessService.checkPolicy("Brand"),
  brandService.fetchById
);

routes.get(
  "/brandcount/:businessId",
  passport.authenticate("jwt", {
    session: false,
  }),
  brandService.brandCount
);

routes.post(
  "/list",
  passport.authenticate("jwt", {
    session: false,
  }),
  brandService.findBrandsUpdated
);

module.exports = routes;
