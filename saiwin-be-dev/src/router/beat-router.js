var express = require("express");
var routes = express.Router();
var beatService = require("../service/beat-service");
var passport = require("passport");
const accessService = require("../service/access-policy-service");

routes.post(
  "/",
  passport.authenticate("jwt", {
    session: false,
  }),
  accessService.checkPolicy("Beat"),
  beatService.create
);

routes.get(
  "/",
  passport.authenticate("jwt", {
    session: false,
  }),
  beatService.findBeats
);

routes.get(
  "/status/:beatId/:status",
  passport.authenticate("jwt", {
    session: false,
  }),
  accessService.checkPolicy("Beat"),
  beatService.changeBeatStatus
);
routes.post(
  "/location",
  passport.authenticate("jwt", {
    session: false,
  }),
  beatService.fetchBeatByLocation
);
module.exports = routes;
