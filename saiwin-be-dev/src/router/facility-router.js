var express = require("express");
var routes = express.Router();
var facilityService = require("../service/facility-service");
var passport = require("passport");
const accessService = require("../service/access-policy-service");

routes.post(
  "/",
  passport.authenticate("jwt", {
    session: false,
  }),
  accessService.checkPolicy("Facility"),
  facilityService.createOrUpdate
);

routes.get(
  "/",
  passport.authenticate("jwt", {
    session: false,
  }),
  facilityService.facilityList
);

routes.get(
  "/status/:facilityId/:status",
  passport.authenticate("jwt", {
    session: false,
  }),
  accessService.checkPolicy("Facility"),
  facilityService.changeFacilityStatus
);

routes.get(
  "/user",
  passport.authenticate("jwt", {
    session: false,
  }),
  facilityService.findFacilityOfLoggedInUser
);

// routes.post(
//   "/location",
//   passport.authenticate("jwt", {
//     session: false,
//   }),
//   facilityService.fetchFacilityForEcom
// );

routes.post(
  "/beat",
  passport.authenticate("jwt", {
    session: false,
  }),
  facilityService.fetchFacilityByBeat
);

module.exports = routes;
