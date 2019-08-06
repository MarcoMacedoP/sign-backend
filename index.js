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
//---------------------------------------------

//Middlewares---------------------------------
// parse aplication/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
app.use(bodyParser.json());
//--------------------------------------------

//Route Middlewares
app.get("/", (req, res) => {
  res.status(200).send("Home is where the haunt is...");
});
