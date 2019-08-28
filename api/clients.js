/* 
    @author :  Marco Macedo 
    @description: This is the client api.

*/
//Modules
const express = require("express");
const router = express.Router();
const debug = require("debug")("app:clientsApi");
//Resources
const { extractJwt } = require("../utils/extractJwt");
const ClientsServices = require("../services/clients");

//**********Routes************

//Get all clients for a user
router.get("/", async (req, res, next) => {
  const { sub: userId } = extractJwt(req);
  const clientsServices = new ClientsServices();

  try {
    const users = await clientsServices.getAll(userId);
    debug(users);
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
});

//Get one client
router.get("/:clientId", async (req, res, next) => {
  const clientsServices = new ClientsServices();
  const { clientId } = req.params;

  try {
    const user = await clientsServices.getOne(clientId);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});
//Create one client
router.post("/", async (req, res, next) => {
  const { sub: userId } = extractJwt(req);
  const clientsServices = new ClientsServices();
  const { name, lastname, email, phone } = req.body;
  try {
    const result = await clientsServices.createOne({
      userId,
      name,
      lastname,
      email,
      phone
    });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});
//Update one client
router.patch("/:clientId", async (req, res, next) => {
  const clientsServices = new ClientsServices();
  const { name, lastname, email, phone } = req.body;
  const { clientId } = req.params;
  try {
    const result = await clientsServices.updateOne({
      clientId,
      name,
      lastname,
      email,
      phone
    });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});
//Remove one client
router.delete("/:clientId", async (req, res, next) => {
  const clientsServices = new ClientsServices();

  const { clientId } = req.params;
  try {
    const result = await clientsServices.remove({ clientId });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

//Export Router
module.exports = router;
