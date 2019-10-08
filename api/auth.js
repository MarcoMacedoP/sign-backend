const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");
const config = require("../config/");
const Boom = require("@hapi/boom");
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

//Signup and obtain token
router.post("/signup", async (req, res, next) => {
  try {
    debug("request.body : ");
    debug(req.body);
    const {email, password} = req.body;
    const userServices = new UserServices();
    const user = await userServices.signUp(req.body);
    if (user) {
      //TODO: put this into a single file
      // Add result to basic auth header and authtenticate
      const authHeader = `${email}:${password}`;
      const buffer = Buffer.from(authHeader);
      const authHeaderBase64 = buffer.toString("base64");
      req.headers.authorization = `Basic ${authHeaderBase64}==`;
      authenticateUser(req, res, next);
    }
  } catch (error) {
    debug("Error:", Object.keys(error));
    debug(error.code);
    //duplicate entry on signup
    if (error.code === "ER_DUP_ENTRY") {
      debug("duplicate entry");
      next(Boom.unauthorized());
    } else {
      next(error);
    }
  }
});

//refresh the token from an existing token
router.post("/token", (req, res) => {
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
  debug(req.headers);
  passport.authenticate("basic", function(error, user) {
    debug(user);
    try {
      if (error) {
        next(error);
      }
      if (!user) {
        next(Boom.unauthorized());
      } else {
        req.logIn(user, {session: false}, async error => {
          if (error) {
            next(Boom.unauthorized());
          } else {
            const token = signToken({
              sub: user.user_id,
              email: user.email
            });
            sendGoodResponse({
              response: res,
              message: "good auth",
              data: {
                token,
                user: {
                  id: user.user_id,
                  name: user.name,
                  lastname: user.lastname,
                  profilePic: user.profile_pic_url,
                  bio: user.biography,
                  job: user.job_title
                }
              }
            });
          }
        });
      }
    } catch (error) {
      next(Boom.unauthorized());
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
