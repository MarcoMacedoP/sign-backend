//Dependencies and resources
const express = require("express");
const router = express.Router();
const passport = require("passport");
//Services
const ProvidersServices = require("../services/providers");
//JWT strategy
require("../utils/auth/strategies/jwt");
//Extract JWT
const { extractJwt } = require("../utils/extractJwt");
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const { sub: userId } = extractJwt(req); //Extract sub from JWT and store it as userId
      console.log(userId);
      const providersServices = new ProvidersServices();
      const providers = await providersServices.getAll({ userId });
      res.status(200).json(providers);
    } catch (error) {
      next(error);
    }
  }
);

router.get("/:providerId", async (req, res, next) => {
  try {
    const { providerId } = req.params;
    const providersServices = new ProvidersServices();
    const provider = await providersServices.getOne({ providerId });
    res.status(200).json(provider);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
