//Modules
const express = require("express");
const body_parser = require("body-parser");
const passport = require("passport");
const session = require("express-session");
//Funcions
const app = express();

//Middlewares
app.use(body_parser.urlencoded({ extended: true }));
// __________passport
app.use(session({ secret: "keyboard cat", resave: true, saveUninitialized: true })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

//Route Files
let userRoute = require("./routes/User");
let projectRoute = require("./routes/Project");

app.get("/", (request, response) => {
  response.send("Home is where the haunt is...");
});

//Routes
app.use(userRoute);
app.use(projectRoute);
module.exports = app;
