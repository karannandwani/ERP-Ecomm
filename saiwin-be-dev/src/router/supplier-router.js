var express = require("express");
var routes = express.Router();
var supplierService = require("../service/supplier-service");
var passport = require("passport");

routes.post(
  "/",
  passport.authenticate("jwt", {
    session: false,
  }),
  supplierService.create
);

routes.get(
  "/",
  passport.authenticate("jwt", {
    session: false,
  }),
  supplierService.fetchSupplier
);

routes.post(
  "/ids",
  passport.authenticate("jwt", {
    session: false,
  }),
  supplierService.supplierByIds
);

module.exports = routes;
