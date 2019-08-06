//Dependencies and resources
const express = require("express");
const router = express.Router();
//Services
const ProvidersServices = require("../../services/providers");

router.get("/", async (req, res, next) => {
  try {
    const providersServices = new ProvidersServices();
    const providers = await providersServices.getAll();
    res.status(200).json(providers);
  } catch (error) {
    next(error);
  }
});
module.exports = router;
