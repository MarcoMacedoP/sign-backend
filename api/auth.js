const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");
const config = require("../config/");
const debug = require("debug")("app:api:auth");
//Services
const UserServices = require("../services/users");
//basic strategy
require("../utils/auth/strategies/basic");
router.post("/login", async (req, res, next) => {
  //cambiar a log in
  ///Login and obtain token
  authenticateUser(req, res, next);
});

router.post("/signup", async (req, res, next) => {
  //Signup and obtain token
  try {
    debug(req.body);
    res.status(200).json({ message: "helo there" });
    // const userServices = new UserServices();
    // const { email, password } = await userServices.signUp(req.body);
    // // Add result to basic auth header and authtenticate
    // const authHeader = `${email}:${password}`;
    // const buffer = Buffer.from(authHeader);
    // const authHeaderBase64 = buffer.toString("base64");
    // req.headers.authorization = `Basic ${authHeaderBase64}==`;
    // authenticateUser(req, res, next);
  } catch (error) {
    next(error);
  }
});
function authenticateUser(req, res, next) {
  passport.authenticate("basic", function(error, user) {
    try {
      if (error) {
        next(error);
      }
      if (!user) {
        next(new Error("No user"));
      } else {
        req.logIn(user, { session: false }, async (error) => {
          if (error) {
            next(new Error("Bad pass"));
          } else {
            const payload = {
              sub   : user.user_id,
              email : user.email
            };
            const token = jwt.sign(payload, config.authJwtSecret, {
              expiresIn : "15m"
            });
            res.status(200).json({ accestoken: token });
          }
        });
      }
    } catch (error) {
      next(new Error("Error on auth"));
    }
  })(req, res, next);
}
module.exports = router;
