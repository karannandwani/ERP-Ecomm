var express = require("express");
var routes = express.Router();
var inventoryService = require("../service/inventory-service");
var passport = require("passport");

routes.post(
  "/",
  passport.authenticate("jwt", {
    session: false,
  }),
  inventoryService.fetchInventory
);

routes.get(
  "/brandcount",
  passport.authenticate("jwt", {
    session: false,
  }),
  inventoryService.totalBrands
);

routes.get(
  "/product/:productId",
  passport.authenticate("jwt", {
    session: false,
  }),
  inventoryService.fetchInventoryOfProduct
);

routes.get(
  "/productcount",
  passport.authenticate("jwt", {
    session: false,
  }),
  inventoryService.productCount
);

routes.get(
  "/noOfProductOutOfStock",
  passport.authenticate("jwt", {
    session: false,
  }),
  inventoryService.noOfProductOutOfStock
);

routes.post(
  "/products",
  passport.authenticate("jwt", {
    session: false,
  }),
  inventoryService.fetchInventoryOfProducts
);

routes.post(
  "/inventoryDetails",
  passport.authenticate("jwt", {
    session: false,
  }),
  inventoryService.inventoryDetails
);

routes.post(
  "/products/returns",
  passport.authenticate("jwt", {
    session: false,
  }),
  inventoryService.fetchProductByInventory
);

routes.post(
  "/stock-update",
  passport.authenticate("jwt", {
    session: false,
  }),
  inventoryService.updateStocks
);

routes.post(
  "/barcode",
  passport.authenticate("jwt", {
    session: false,
  }),
  inventoryService.fetchLotDetails
);

routes.post(
  "/products/ecom",
  passport.authenticate("jwt", {
    session: false,
  }),
  inventoryService.fetchProductsForEcommerce
);
module.exports = routes;
