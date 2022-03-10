var express = require("express");
var routes = express.Router();
var manufacturerService = require("../service/manufacturer-service");
var passport = require("passport");
const accessService = require("../service/access-policy-service");

routes.post(
  "/",
  passport.authenticate("jwt", {
    session: false,
  }),
  accessService.checkPolicy("Manufacturer"),
  manufacturerService.create
);

routes.get(
  "/",
  passport.authenticate("jwt", {
    session: false,
  }),
  manufacturerService.findManufacturers
);

routes.post(
  "/list",
  passport.authenticate("jwt", {
    session: false,
  }),
  manufacturerService.findManufacturersUpdated
);

routes.get(
  "/status/:manufacturerId/:status",
  passport.authenticate("jwt", {
    session: false,
  }),
  accessService.checkPolicy("Manufacturer"),
  manufacturerService.changeManufacturerStatus
);

module.exports = routes;
