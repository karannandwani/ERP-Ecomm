var express = require("express");
var routes = express.Router();
var returnService = require("../service/return-service");
var passport = require("passport");
const accessService = require("../service/access-policy-service");

routes.post(
  "/",
  passport.authenticate("jwt", {
    session: false,
  }),
  accessService.checkPolicy("Return"),
  returnService.create
);

routes.get(
  "/",
  passport.authenticate("jwt", {
    session: false,
  }),
  returnService.fetchReturns
);

routes.post(
  "/list",
  passport.authenticate("jwt", {
    session: false,
  }),
  returnService.fetchReturnsNew
);

routes.get(
  "/count",
  passport.authenticate("jwt", {
    session: false,
  }),
  returnService.fetchReturnCountForLast24Hour
);

routes.get(
  "/:returnId",
  passport.authenticate("jwt", {
    session: false,
  }),
  returnService.findById
);

routes.post(
  "/reject",
  passport.authenticate("jwt", {
    session: false,
  }),
  returnService.rejectReturn
);

routes.post(
  "/accept",
  passport.authenticate("jwt", {
    session: false,
  }),
  returnService.acceptReturnNew
);

routes.post(
  "/assignVehicle",
  passport.authenticate("jwt", {
    session: false,
  }),
  returnService.assignVehicle
);

routes.post(
  "/deliverReturn",
  passport.authenticate("jwt", {
    session: false,
  }),
  returnService.deliverReturn
);

routes.get(
  "/generatePassword/:returnId",
  passport.authenticate("jwt", {
    session: false,
  }),
  returnService.generatePassword
);

module.exports = routes;
