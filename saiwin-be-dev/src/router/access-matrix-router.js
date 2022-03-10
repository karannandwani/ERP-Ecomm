var express = require("express");
var routes = express.Router();
var accessMatrixService = require("../service/access-matrix-service");
var passport = require("passport");

routes.post(
  "/",
  passport.authenticate("jwt", {
    session: false,
  }),
  accessMatrixService.create
);

module.exports = routes;
