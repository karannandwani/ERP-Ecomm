var express = require("express");
var routes = express.Router();
var vehicleService = require("../service/vehicle-service");
var passport = require("passport");
const accessService = require("../service/access-policy-service");

routes.post(
  "/",
  passport.authenticate("jwt", {
    session: false,
  }),
  accessService.checkPolicy("Vehicle"),
  vehicleService.create
);

routes.get(
  "/",
  passport.authenticate("jwt", {
    session: false,
  }),
  vehicleService.findvehicles
);

routes.post(
  "/list",
  passport.authenticate("jwt", {
    session: false,
  }),
  vehicleService.findvehiclesNew
);

routes.get(
  "/status/:vehicleId/:status",
  passport.authenticate("jwt", {
    session: false,
  }),
  accessService.checkPolicy("Vehicle"),
  vehicleService.changeVehicleStatus
);

module.exports = routes;
