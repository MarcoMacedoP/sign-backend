//Modules
const express = require("express");
const bodyParser = require("body-parser");
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
const userProvidersApiRoute = require("./api/providers/user-providers");
const expensesApiRoute = require("./api/providers/expenses");
const clientsApiRoute = require("./api/clients");
const remindersApiRoute = require("./api/reminders/reminders");
const teamsApiRoute = require("./api/teams/teams");
const userProjectsApiRoute = require("./api/projects/user-projects");
const activitiesProjectsApiRoute = require("./api/projects/activities-projects");
const clientsProjectsApiRoute = require("./api/projects/clients-projects");
const userNotificationsRoute = require("./api/notifications/user-notifications");
//---------------------------------------------

//Middlewares---------------------------------
// parse aplication/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true, limit: "50mb"}));
// parse application/json
app.use(bodyParser.json({limit: "50mb"}));
// cors
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");

  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "PUT, GET, POST, DELETE, OPTIONS, PATCH"
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

//----provider routes---------
app.use(
  "/api/providers",
  passport.authenticate("jwt", {session: false}),
  providersApiRoute
);
app.use(
  "/api/providers/user",
  passport.authenticate("jwt", {session: false}),
  userProvidersApiRoute
);
//----provider routes---------

app.use(
  "/api/expenses",
  passport.authenticate("jwt", {session: false}),
  expensesApiRoute
);

app.use(
  "/api/users",
  passport.authenticate("jwt", {session: false}),
  usersApiRoute
);

app.use(
  "/api/clients",
  passport.authenticate("jwt", {session: false}),
  clientsApiRoute
);
app.use(
  "/api/teams",
  passport.authenticate("jwt", {session: false}),
  teamsApiRoute
);
app.use(
  "/api/reminders",
  passport.authenticate("jwt", {session: false}),
  remindersApiRoute
);
//      project--routes
app.use(
  "/api/projects",
  passport.authenticate("jwt", {session: false}),
  userProjectsApiRoute
);
app.use(
  "/api/projects/activities",
  passport.authenticate("jwt", {session: false}),
  activitiesProjectsApiRoute
);
app.use(
  "/api/projects/clients",
  passport.authenticate("jwt", {session: false}),
  clientsProjectsApiRoute
);
//Notifications routes
app.use(
  "/api/notifications/user",
  passport.authenticate("jwt", {session: false}),
  userNotificationsRoute
);
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
