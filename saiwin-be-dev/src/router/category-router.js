var express = require("express");
var routes = express.Router();
var categoryService = require("../service/category-service");
var passport = require("passport");
const accessService = require("../service/access-policy-service");

routes.post(
  "/",
  passport.authenticate("jwt", {
    session: false,
  }),
  accessService.checkPolicy("Category"),
  categoryService.create
);

routes.post(
  "/fetchCategory",
  passport.authenticate("jwt", {
    session: false,
  }),
  categoryService.findCategories
);

routes.get(
  "/status/:categoryId/:status",
  passport.authenticate("jwt", {
    session: false,
  }),
  accessService.checkPolicy("Category"),
  categoryService.changeCategoryStatus
);

routes.get("/image", categoryService.fetchImage);

module.exports = routes;
