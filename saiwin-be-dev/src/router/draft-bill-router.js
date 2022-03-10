var express = require("express");
var routes = express.Router();
var draftBill = require("../service/draft-bill-service");
var passport = require("passport");

routes.post(
  "/",
  passport.authenticate("jwt", {
    session: false,
  }),
  draftBill.createBill
);

routes.get(
  "/:facility",
  passport.authenticate("jwt", {
    session: false,
  }),
  draftBill.fetchDraftBill
);

routes.get(
  "/fetchById/:id",
  passport.authenticate("jwt", {
    session: false,
  }),
  draftBill.fetchDraftById
);

routes.delete(
  "/delete/:draftId",
  passport.authenticate("jwt", {
    session: false,
  }),
  draftBill.deleteDraftBill
);

routes.post(
  "/fetch",
  passport.authenticate("jwt", {
    session: false,
  }),
  draftBill.fetchDraftBillByFacilities
);

module.exports = routes;
