//Dependencies and resources
const express = require("express");
const router = express.Router();
const debug = require("debug")("app:api:services");
//services
const ProvidersServicesServices = require("../../services/providers/services");
//functions
const { extractJwt } = require("../../utils/extractJwt");

//Routes-----------------------------------------------------------------------------
router.get("/", async (req, res, next) => {
  //get all
  const { providerId } = req.body;
  debug(req.body);
  const providersServicesServices = new ProvidersServicesServices();
  const services = await providersServicesServices.getAll({
    providerId
  });
  res.status(200).json(services);
});
router.post("/", (req, res, next) => {
  //Add service
  const { name, description, cost, costPerHour } = req.body;
});
router.get("/:serviceId", (req, res, next) => {
  //get service
});
router.patch("/:serviceId", (req, res, next) => {
  //update service
});
router.delete("/:serviceId", (req, res, next) => {
  //remove service
});
module.exports = router;
