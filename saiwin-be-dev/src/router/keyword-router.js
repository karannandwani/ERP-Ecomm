var express = require("express");
var routes = express.Router();
var keywordService = require("../service/keyword-service");
var passport = require("passport");



routes.get(
    "/",
    passport.authenticate("jwt", {
        session: false,
    }),
    keywordService.fetchkeywords
);

module.exports = routes;
