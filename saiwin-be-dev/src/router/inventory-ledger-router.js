var express = require("express");
var routes = express.Router();
var inventoryLedgerService = require("../service/inventory-ledger-service");
var passport = require("passport");

routes.get(
  "/",
  passport.authenticate("jwt", {
    session: false,
  }),
  inventoryLedgerService.fetchInventoryLedger
);

routes.post(
  "/details",
  passport.authenticate("jwt", {
    session: false,
  }),
  inventoryLedgerService.inventoryLedgerDetails
);

routes.post(
  "/",
  passport.authenticate("jwt", {
    session: false,
  }),
  inventoryLedgerService.inventoryLedgerDetailsUpdated
);

module.exports = routes;
