var express = require("express");
var routes = express.Router();
var userService = require("../service/user-service");
var passport = require("passport");

routes.post("/register", userService.registerUser);

routes.post("/login", userService.loginUser);

routes.get(
  "/profile",
  passport.authenticate("jwt", {
    session: false,
  }),
  userService.userProfile
);

routes.get(
  "/password/compare/:password",
  passport.authenticate("jwt", {
    session: false,
  }),
  userService.comparePassword
);

routes.get(
  "/password/change/:password",
  passport.authenticate("jwt", {
    session: false,
  }),
  userService.changePassword
);

routes.get("/password/forgot/:email", userService.forgotPassword);

routes.post("/password/code-match", userService.checkEmailCode);

routes.post("/password/reset", userService.setPasswordforForgot);

routes.post(
  "/list",
  passport.authenticate("jwt", {
    session: false,
  }),
  userService.fetchUsers
);

routes.get(
  "",
  passport.authenticate("jwt", {
    session: false,
  }),
  userService.findSalesPerson
);

routes.get(
  "/business/changeSelected",
  passport.authenticate("jwt", {
    session: false,
  }),
  userService.changeSelectedBusiness
);

routes.post(
  "/addAddress",
  passport.authenticate("jwt", {
    session: false,
  }),
  userService.addAddressInUser
);

routes.post("/sendOtp", userService.sendOtp);

module.exports = routes;
