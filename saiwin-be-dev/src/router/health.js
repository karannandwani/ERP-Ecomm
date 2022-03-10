var express = require("express"),
  routes = express.Router();

routes.get("/", function (req, res) {
  return res.send("check ok");
});
module.exports = routes;
