var express = require("express");
var routes = express.Router();
var leadService = require("../service/lead-service");
var passport = require("passport");
const accessService = require("../service/access-policy-service");

routes.post(
    "/",
    passport.authenticate("jwt", { session: false }),
    accessService.checkPolicy("Lead"),
    leadService.addLead
  );
  routes.get(
    "/",
    passport.authenticate("jwt", { session: false }),
    leadService.viewLead
  );
  routes.get(
    "/details/:leadId",
    passport.authenticate("jwt", { session: false }),
    leadService.leadById
  );
  
  routes.post(
    "/followUp",
    passport.authenticate("jwt", { session: false }),
    leadService.commentInLead
  );

module.exports = routes;
