var express = require("express");
var routes = express.Router();
var facilityMapService = require("../service/facility-user-mapping-service");
var passport = require("passport");

routes.post(
  "/",
  passport.authenticate("jwt", {
    session: false,
  }),
  facilityMapService.add
);

routes.get(
  "/",
  passport.authenticate("jwt", {
    session: false,
  }),
  facilityMapService.fetch
);

routes.get(
  "/:facility",
  passport.authenticate("jwt", {
    session: false,
  }),
  facilityMapService.fetchByFacility
);

routes.delete(
  "/remove/user/:mapId",
  passport.authenticate("jwt", {
    session: false,
  }),
  facilityMapService.removeUser
);

routes.get(
  "/change/:facility",
  passport.authenticate("jwt", {
    session: false,
  }),
  facilityMapService.updateSelected
);

module.exports = routes;
