var express = require("express");
var routes = express.Router();
var pricelistGroupService = require("../service/pricelist-group-service");
var passport = require("passport");
const accessService = require("../service/access-policy-service");

routes.post(
  "/",
  passport.authenticate("jwt", {
    session: false,
  }),
  accessService.checkPolicy("Pricelist Group"),
  pricelistGroupService.create
);

routes.get(
  "/",
  passport.authenticate("jwt", {
    session: false,
  }),
  pricelistGroupService.findPriceList
);

routes.get(
  "/status/:groupId/:status",
  passport.authenticate("jwt", {
    session: false,
  }),
  accessService.checkPolicy("Pricelist Group"),
  pricelistGroupService.changePricelistGroupStatus
);

routes.post(
  "/list",
  passport.authenticate("jwt", {
    session: false,
  }),
  pricelistGroupService.findPriceListUpdated
);

module.exports = routes;
