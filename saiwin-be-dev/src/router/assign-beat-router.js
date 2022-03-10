var express = require("express");
var routes = express.Router();
var assignBeatService = require("../service/assign-beat-service");
var passport = require("passport");

routes.post(
  "/",
  passport.authenticate("jwt", {
    session: false,
  }),
  assignBeatService.createAssignBeat
);

routes.get(
  "/",
  passport.authenticate("jwt", {
    session: false,
  }),
  assignBeatService.fetchAssignBeatList
);

routes.get(
  "/beatDateListDetails",
  passport.authenticate("jwt", { session: false }),
  assignBeatService.assigBeatDateListDetail
);

module.exports = routes;
