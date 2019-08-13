const express = require("express");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const router = express.Router();
const config = require("../config/");

//basic strategy
require("../utils/auth/strategies/basic");

router.post("/token", async (req, res, next) => {
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
            const payload = { sub: user.user_id, email: user.email };
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
});
module.exports = router;
