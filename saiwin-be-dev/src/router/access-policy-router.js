var express = require("express");
var routes = express.Router();
var passport = require("passport");
const accessService = require("../service/access-policy-service");

routes.post(
  "/",
  passport.authenticate("jwt", {
    session: false,
  }),
  accessService.createPolicy
);

routes.get(
  "/",
  passport.authenticate("jwt", {
    session: false,
  }),
  accessService.fetchPolicies
);

routes.delete(
  "/delete/:policyId",
  passport.authenticate("jwt", {
    session: false,
  }),
  accessService.deletePolicy
);

module.exports = routes;
