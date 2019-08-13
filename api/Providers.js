//Dependencies and resources
const express = require("express");
const router = express.Router();
//Services
const ProvidersServices = require("../services/providers");

router.get("/", async (req, res, next) => {
  try {
    const providersServices = new ProvidersServices();
    const providers = await providersServices.getAll();
    res.status(200).json(providers);
  } catch (error) {
    next(error);
  }
});

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
