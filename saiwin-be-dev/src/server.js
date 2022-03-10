var express = require("express");
var bodyParser = require("body-parser");
var passport = require("passport");
var mongoose = require("mongoose");
var config = require("./config/config");
var app = express();
var cors = require("cors");
var logger = require("morgan");

const { createOnStart, addMenuItem } = require("./service/init-service");

var PORT = process.env.PORT || 4000;

const expressSwagger = require("express-swagger-generator")(app);

let options = {
  swaggerDefinition: {
    info: {
      description: "SaiWin india pvt. limited",
      title: "SaiWin",
      version: "0.0.1",
    },
    host: "10.1.1.110:7000",
    basePath: "/api",
    produces: ["application/json", "application/xml"],
    schemes: ["http", "https"],
    securityDefinitions: {
      JWT: {
        type: "apiKey",
        in: "header",
        name: "Authorization",
        description: "",
      },
    },
  },
  basedir: __dirname, //app absolute path
  files: ["./**/*.js"], //Path to the API handle folder
};

expressSwagger(options);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: "50mb", type: "application/json" }));

app.get("/", cors(), function (req, res) {
  return res.send("Hello" + PORT);
});

app.use(passport.initialize());
var passportMiddleware = require("./middleware/passport");
passport.use(passportMiddleware);

var routes = require("./router/index");
const health = require("./router/health");

const { checkExpire } = require("./service/inventory-service");
const { notificationInit } = require("./utils/notification-util");
app.use(logger("dev"));
app.use("/api", cors(), routes);
app.use("/health", cors(), health);

mongoose.connect(config.db, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
const connection = mongoose.connection;

connection.once("open", () => {
  console.log("Connection established with mongoDB");
  createOnStart();
  addMenuItem();
  notificationInit();
  checkExpire;
});

connection.on("error", (err) => {
  console.log("Error while connection to mongoDB" + err);
  process.exit();
});

app.listen(PORT);
