var express = require("express");
var routes = express.Router();
var productService = require("../service/product-service");
var passport = require("passport");
const accessService = require("../service/access-policy-service");

routes.post(
  "/",
  passport.authenticate("jwt", {
    session: false,
  }),
  accessService.checkPolicy("Product"),
  productService.create
);

routes.post(
  "/list",
  passport.authenticate("jwt", {
    session: false,
  }),
  productService.fetchProducts
);

routes.post(
  "/with-stock",
  passport.authenticate("jwt", {
    session: false,
  }),
  productService.fetchProductWithStock
);

routes.get(
  "/:productId",
  passport.authenticate("jwt", {
    session: false,
  }),
  productService.productById
);

routes.get(
  "/productcount/:business",
  passport.authenticate("jwt", {
    session: false,
  }),
  productService.productCount
);

routes.get(
  "/brandcount/:business",
  passport.authenticate("jwt", {
    session: false,
  }),
  productService.brandCount
);

routes.post(
  "/fetch-for-return",
  passport.authenticate("jwt", {
    session: false,
  }),
  productService.fetchProductForReturn
);

routes.post(
  "/create-multiple",
  passport.authenticate("jwt", {
    session: false,
  }),
  productService.createMultiple
);

routes.get("/download/template", productService.downloadTemplate);

routes.post(
  "/update/returnable",
  passport.authenticate("jwt", {
    session: false,
  }),
  productService.changeReturnableStatus
);

routes.get("/image/view", productService.fetchImage);

module.exports = routes;
