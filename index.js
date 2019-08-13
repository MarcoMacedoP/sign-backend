//Modules
const express = require("express");
const bodyParser = require("body-parser");

//Config
const { port } = require("./config/");
const app = express();

//Server init
app.listen(port, () => {
  console.log("server startded at port", port);
});

//Routes---------------------------------------
const authApiRoute = require("./api/auth");
const providersApiRoute = require("./api/Providers");
const usersApiRoute = require("./api/users");
//---------------------------------------------

//Middlewares---------------------------------
// parse aplication/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
app.use(bodyParser.json());
//--------------------------------------------

//Route Middlewares
app.use("/api/auth", authApiRoute);
app.use("/api/providers", providersApiRoute);
app.use("/api/users", usersApiRoute);
//Views
app.get("/", (req, res) => {
  res.status(200).send("Home is where the haunt is...");
});
