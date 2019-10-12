const express = require("express");
const router = express.Router();
const Boom = require("@hapi/boom");
const debug = require("debug")("app:api:auth");
//Services
const UserServices = require("../services/users");
const RefreshToken = require("../services/refreshToken");
//utils
const {sendGoodResponse} = require("../utils/responses");
const authenticateUser = require("../utils/auth/authenticateUser");
const createBasicAuthHeader = require("../utils/auth/createBasicAuthHeader");

//----------------endpoints-----------------------

///Login and obtain token
router.post("/login", async (req, res, next) => {
  try {
    await authenticateUser(req, res, next);
  } catch (error) {
    next(error);
  }
});

//Signup and obtain token
router.post("/signup", async (req, res, next) => {
  try {
    const {email, password} = req.body;
    const userServices = new UserServices();
    const user = await userServices.signUp(req.body);
    if (user) {
      req.headers.authorization = createBasicAuthHeader(
        email,
        password
      );
      authenticateUser(req, res, next);
    }
  } catch (error) {
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
//delete a refresh token
router.delete("/token", async (req, res, next) => {
  const {refreshToken} = req.body;
  const tokenServices = new RefreshToken();
  try {
    await tokenServices.removeRefreshToken(refreshToken);
    sendGoodResponse({
      response: res,
      message: "Token deleted succesfully"
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
