//Dependencies and resources
const express = require("express");
const router = express.Router();
const debug = require("debug")("app:api:services");
//services
const ProvidersServicesServices = require("../../services/providers/incomes");
//functions

//Routes-----------------------------------------------------------------------------
router.get("/", async (req, res, next) => {
  //get all
  const {providerId} = req.body;
  const providersServicesServices = new ProvidersServicesServices({
    isProduct: true
  });
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
  //Add product
  const { name, description, cost, providerId} = req.body; // prettier-ignore
  const providersServicesServices = new ProvidersServicesServices({
    isProduct: true
  });
  try {
    const {insertId : addedproductId} = await providersServicesServices.create({
                 name, description, cost, providerId, isProduct:true}); // prettier-ignore

    res
      .status(200)
      .json({addedproductId, message: "Product created"});
  } catch (error) {
    next(error);
  }
});
router.get("/:productId", async (req, res, next) => {
  //get one product by it's id
  const {productId} = req.params;
  const providersServicesServices = new ProvidersServicesServices({
    isProduct: true
  });
  try {
    const updatedProduct = await providersServicesServices.getOne({
      serviceId: null,
      productId
    });
    res.status(200).json(updatedProduct);
  } catch (error) {
    next(error);
  }
});
router.patch("/:productId", async (req, res, next) => {
  //update service
  const {productId} = req.params;
  const providersServicesServices = new ProvidersServicesServices({
    isProduct: true
  });
  try {
    const result = await providersServicesServices.update({
      productId,
      data: req.body
    });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});
router.delete("/:productId", async (req, res, next) => {
  //remove service by is id
  const {productId} = req.params;
  const providersServicesServices = new ProvidersServicesServices({
    isProduct: true
  });
  try {
    const deletedService = await providersServicesServices.remove({
      serviceId: null,
      isProduct: true,
      productId
    });
    res.status(200).json(deletedService);
  } catch (error) {
    next(error);
  }
});
module.exports = router;
