//Modules
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");

//Config
const {port} = require("./config/");
const app = express();

//Server init
app.listen(port, () => {
  console.log("server startded at port", port);
});

//Routes---------------------------------------
const authApiRoute = require("./api/auth");
const usersApiRoute = require("./api/users");
const providersApiRoute = require("./api/providers/providers");
const providersServicesApiRoute = require("./api/providers/services");
const providersProductsApiRoute = require("./api/providers/products");
const clientsApiRoute = require("./api/clients");
const remindersApiRoute = require("./api/reminders/reminders");
const testRoute = require("./api/test");
//---------------------------------------------

//Middlewares---------------------------------
// parse aplication/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));
// parse application/json
app.use(bodyParser.json());
// cors
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");

  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "PUT, GET, POST, DELETE, OPTIONS"
  );
  next();
});
//serve static files, resources from public folder
app.use(
  "/static/uploads",
  express.static(`${__dirname}/public/static/uploads/`)
);

//--------------------------------------------

//JWT strategy
require("./utils/auth/strategies/jwt");

//Route Middlewares
app.use("/api/auth", authApiRoute);

app.use(
  "/api/providers",
  passport.authenticate("jwt", {session: false}),
  providersApiRoute
);
app.use(
  "/api/services",
  passport.authenticate("jwt", {session: false}),
  providersServicesApiRoute
);
app.use(
  "/api/products",
  passport.authenticate("jwt", {session: false}),
  providersProductsApiRoute
);
app.use("/api/users", usersApiRoute);
app.use("/api/test", testRoute);

app.use(
  "/api/clients",
  passport.authenticate("jwt", {session: false}),
  clientsApiRoute
);
app.use("/api/reminders", remindersApiRoute);

//Error handlers----------
const {
  logErrors,
  wrapErrors,
  clientErrorHandler,
  errorHandler
} = require("./utils/middlewares/errorHandlers");

//Middlewares
app.use(logErrors);
app.use(wrapErrors);
app.use(clientErrorHandler);
app.use(errorHandler);

//Views
app.get("/", (req, res) => {
  res.status(200).json({message: "Home is where the haunt is..."});
});
