var express = require("express");
var routes = express.Router();
var slideService = require("../service/slide-service");
var passport = require("passport");

routes.post(
  "/",
  passport.authenticate("jwt", {
    session: false,
  }),
  slideService.create
);

routes.post(
  "/list",
  passport.authenticate("jwt", {
    session: false,
  }),
  slideService.fetch
);

routes.get("/image", slideService.fetchImage);

module.exports = routes;
