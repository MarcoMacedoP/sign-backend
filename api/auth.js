const express = require("express");
const router = express.Router();
const passport = require("passport");
const Boom = require("@hapi/boom");
const debug = require("debug")("app:api:auth");
//Services
const UserServices = require("../services/users");
const RefreshToken = require("../services/refreshToken");
//utils
const signToken = require("../utils/auth/signToken");

//basic strategy
require("../utils/auth/strategies/basic");
//jwt-strategy
require("../utils/auth/strategies/jwt");

//utils
const {sendGoodResponse} = require("../utils/responses");
router.post("/login", async (req, res, next) => {
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
router.post("/token", async (req, res, next) => {
  const {refreshToken} = req.body;
  try {
    const refresh = new RefreshToken();
    const accessToken = await refresh.getAccessTokenFromRefreshToken(
      refreshToken
    );
    debug(accessToken);
    sendGoodResponse({
      response: res,
      message: "Token updated succesfully",
      data: {accessToken}
    });
  } catch (error) {
    next(error);
  }
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
            debug("GOOOOD RESPONSE");
            const accessToken = signToken({
              sub: user.user_id,
              email: user.email
            });
            const refreshToken = await new RefreshToken().create(
              user.user_id,
              user.email
            );

            sendGoodResponse({
              response: res,
              message: "good auth",
              data: {
                token: {
                  accessToken,
                  refreshToken
                },
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

module.exports = router;
