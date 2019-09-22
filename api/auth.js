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
//utils
const {sendGoodResponse} = require("../utils/responses");
router.post("/login", async (req, res, next) => {
  //cambiar a log in
  ///Login and obtain token
  debug(req.headers.authorization);
  authenticateUser(req, res, next);
});

router.post("/signup", async (req, res, next) => {
  //Signup and obtain token
  try {
    debug(req.body);
    const userServices = new UserServices();
    const {email, password} = await userServices.signUp(req.body);
    // Add result to basic auth header and authtenticate
    const authHeader = `${email}:${password}`;
    const buffer = Buffer.from(authHeader);
    const authHeaderBase64 = buffer.toString("base64");
    req.headers.authorization = `Basic ${authHeaderBase64}==`;
    authenticateUser(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.post("/token", (req, res) => {
  //refresh the token from an existing token
  const {token} = req.body;
  const {sub, email} = jwt.decode(token);
  const newToken = signToken({sub, email});
  sendGoodResponse({
    response: res,
    message: "Token updated succesfully",
    data: {token: newToken}
  });
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
        req.logIn(user, {session: false}, async error => {
          if (error) {
            next(new Error("Bad pass"));
          } else {
            const token = signToken({
              sub: user.user_id,
              email: user.email
            });
            sendGoodResponse({
              response: res,
              message: "good auth",
              data: {token}
            });
          }
        });
      }
    } catch (error) {
      next(new Error("Error on auth"));
    }
  })(req, res, next);
}
function signToken({sub, email}) {
  const payload = {
    sub,
    email
  };
  return jwt.sign(payload, config.authJwtSecret, {
    expiresIn: "15m"
  });
}
module.exports = router;
