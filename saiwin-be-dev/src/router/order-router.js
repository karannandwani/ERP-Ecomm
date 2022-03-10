var express = require("express");
var routes = express.Router();
var orderService = require("../service/order-service");
var passport = require("passport");
const accessService = require("../service/access-policy-service");
const orderCountService = require("../service/order-count-service");
const billService = require("../service/bill-service");
const draftOrderService = require("../service/draft-order-service");

routes.post(
  "/generate",
  passport.authenticate("jwt", {
    session: false,
  }),
  accessService.checkPolicy("Order"),
  orderService.generateOrderForFacility
);

routes.post(
  "/generate/bill",
  passport.authenticate("jwt", {
    session: false,
  }),
  accessService.checkPolicy("Order"),
  billService.createBill
);

routes.post(
  "/",
  passport.authenticate("jwt", {
    session: false,
  }),
  orderService.fetchOrderUpdated
);

routes.get(
  "/",
  passport.authenticate("jwt", {
    session: false,
  }),
  orderService.fetchOrder
);

routes.get(
  "/details/:orderId",
  passport.authenticate("jwt", {
    session: false,
  }),
  orderService.findById
);

routes.post(
  "/save",
  passport.authenticate("jwt", {
    session: false,
  }),
  accessService.checkPolicy("Order"),
  orderService.saveOrder
);

routes.post(
  "/acceptOrder",
  passport.authenticate("jwt", {
    session: false,
  }),
  accessService.checkPolicy("Order"),
  orderService.acceptOrder
);

routes.post(
  "/deliverOrder",
  passport.authenticate("jwt", {
    session: false,
  }),
  accessService.checkPolicy("Order"),
  orderService.deliverOrder
);

routes.get(
  "/generatePassword/:orderId",
  passport.authenticate("jwt", {
    session: false,
  }),
  orderService.generatePassword
);

routes.post(
  "/assignVehicle",
  passport.authenticate("jwt", {
    session: false,
  }),
  accessService.checkPolicy("Order"),
  orderService.assignVehicle
);

routes.get(
  "/details/invoice/:orderId",
  passport.authenticate("jwt", {
    session: false,
  }),
  accessService.checkPolicy("Order"),
  orderService.fetchDetailsForInvoice
);

routes.get(
  "/details/inventory/:orderId",
  passport.authenticate("jwt", {
    session: false,
  }),
  orderService.fetchOrderDetailsWithInventory
);

routes.post(
  "/rejectOrder",
  passport.authenticate("jwt", {
    session: false,
  }),
  orderService.rejectOrder
);

routes.get(
  "/bill/fetch",
  passport.authenticate("jwt", {
    session: false,
  }),
  billService.fetchBills
);

routes.post(
  "/bill/fetch",
  passport.authenticate("jwt", {
    session: false,
  }),
  billService.fetchBillsNew
);

routes.post(
  "/draft/add",
  passport.authenticate("jwt", {
    session: false,
  }),
  draftOrderService.saveDraftOrder
);
routes.get(
  "/draftList/:facility/:suppliers",
  passport.authenticate("jwt", {
    session: false,
  }),
  draftOrderService.fetchDraftOrder
);

routes.delete(
  "/remove-draft/:draftId",
  passport.authenticate("jwt", {
    session: false,
  }),
  draftOrderService.deleteDraftOrder
);

routes.get(
  "/bill/:billId",
  passport.authenticate("jwt", {
    session: false,
  }),
  billService.designBill
);

routes.post(
  "/fetchPrice",
  passport.authenticate("jwt", {
    session: false,
  }),
  accessService.checkPolicy("Order"),
  orderService.fetchPrice
);

routes.post(
  "/confirmGenerateOrder",
  passport.authenticate("jwt", {
    session: false,
  }),
  accessService.checkPolicy("Order"),
  orderService.confirmGeneratedOrder
);

routes.get(
  "/count",
  passport.authenticate("jwt", {
    session: false,
  }),
  accessService.checkPolicy("Order"),
  orderCountService.orderCount
);

routes.get(
  "/quick-view",
  passport.authenticate("jwt", {
    session: false,
  }),
  orderCountService.orderQuickView
);

routes.post(
  "/draftlist",
  passport.authenticate("jwt", {
    session: false,
  }),
  accessService.checkPolicy("Order"),
  draftOrderService.fetchDrafts
);

routes.post(
  "/e-com",
  passport.authenticate("jwt", {
    session: false,
  }),
  orderService.fetchEcommerceOrder
);

routes.post(
  "/dispatch",
  passport.authenticate("jwt", {
    session: false,
  }),
  orderService.dispatchOrders
);

routes.post(
  "/e-com/update",
  passport.authenticate("jwt", {
    session: false,
  }),
  orderService.updateEcommerceOrder
);
module.exports = routes;
