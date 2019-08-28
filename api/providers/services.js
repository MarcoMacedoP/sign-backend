//Dependencies and resources
const express = require("express");
const router = express.Router();
const debug = require("debug")("app:api:services");
//services
const ProvidersServicesServices = require("../../services/providers/servicesOrProducts");
//functions
const { extractJwt } = require("../../utils/extractJwt");

//Routes-----------------------------------------------------------------------------
router.get("/", async (req, res, next) => {
  //get all
  const { providerId } = req.body;
  debug(req.body);
  const providersServicesServices = new ProvidersServicesServices();
  try {
    const services = await providersServicesServices.getAll({
      providerId
    });
    res.status(200).json(services);
  } catch (error) {
    next(erorr);
  }
});
router.post("/", async (req, res, next) => {
  //Add service
  const { name, description, cost, costPerHour, providerId} = req.body; // prettier-ignore
  const providersServicesServices = new ProvidersServicesServices();
  try {
    const {insertId : addedServiceId} = await providersServicesServices.create({
                 name, description, cost, costPerHour, providerId}); // prettier-ignore

    res.status(200).json({ addedServiceId, message: "Service created" });
  } catch (error) {
    next(error);
  }
});
router.get("/:serviceId", async (req, res, next) => {
  //get one service by it's id
  const { serviceId } = req.params;
  const providersServicesServices = new ProvidersServicesServices();
  try {
    const updatedService = await providersServicesServices.getOne({
      serviceId
    });
    res.status(200).json(updatedService);
  } catch (error) {
    next(error);
  }
});
router.patch("/:serviceId", async (req, res, next) => {
  //update service
  const { serviceId } = req.params;
  const providersServicesServices = new ProvidersServicesServices();
  try {
    const result = await providersServicesServices.update({
      serviceId,
      data      : req.body
    });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});
router.delete("/:serviceId", async (req, res, next) => {
  //remove service by is id
  const { serviceId } = req.params;
  const providersServicesServices = new ProvidersServicesServices();
  try {
    const deletedService = await providersServicesServices.remove({
      serviceId
    });
    res.status(200).json(deletedService);
  } catch (error) {
    next(error);
  }
});
module.exports = router;
