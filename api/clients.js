/* 
    @author :  Marco Macedo 
    @description: This is the client api.

*/
//Modules
const express = require("express");
const router = express.Router();
const debug = require("debug")("app:clientsApi");
const {sendGoodResponse} = require("../utils/responses");
//Resources
const {extractJwt} = require("../utils/extractJwt");
const ClientsServices = require("../services/clients/clients");
//Validation stuff
const validate = require("../utils/middlewares/validationHandler");
const {createClientSchema} = require("../utils/schemas/clients");

//**********Routes************

//Get all clients for a user
router.get("/", async (req, res, next) => {
  debug(req.headers);
  const {sub: userId} = extractJwt(req);
  const clientsServices = new ClientsServices();

  try {
    const clients = await clientsServices.getAll(userId);
    sendGoodResponse({
      response: res,
      message: "get clients",
      statusCode: 200,
      data: clients
    });
  } catch (error) {
    next(error);
  }
});

//Get one client
router.get("/:clientId", async (req, res, next) => {
  const clientsServices = new ClientsServices();
  const {clientId} = req.params;
  try {
    const user = await clientsServices.getOne(clientId);
    sendGoodResponse({
      response: res,
      message: "get a user",
      statusCode: 200,
      data: user
    });
  } catch (error) {
    next(error);
  }
});
//Create one client
router.post(
  "/",
  validate(createClientSchema),
  async (req, res, next) => {
    const {sub: userId} = extractJwt(req);
    const clientsServices = new ClientsServices();
    const {name, lastname, email, phone} = req.body;

    try {
      const client = await clientsServices.createOne({
        userId,
        name,
        lastname,
        email,
        phone
      });
      sendGoodResponse({
        response: res,
        message: "create a client",
        statusCode: 200,
        data: client
      });
    } catch (error) {
      next(error);
    }
  }
);
//Update one client
router.patch("/:clientId", async (req, res, next) => {
  const clientsServices = new ClientsServices();
  const {name, lastname, email, phone} = req.body;
  const {clientId} = req.params;
  try {
    const updatedClient = await clientsServices.updateOne({
      clientId,
      name,
      lastname,
      email,
      phone
    });
    sendGoodResponse({
      response: res,
      message: "update a client",
      statusCode: 201,
      data: updatedClient
    });
  } catch (error) {
    next(error);
  }
});
//Remove one client
router.delete("/:clientId", async (req, res, next) => {
  const clientsServices = new ClientsServices();

  const {clientId} = req.params;
  try {
    await clientsServices.remove({clientId});
    sendGoodResponse({
      response: res,
      message: "remove a client",
      statusCode: 201,
      data: []
    });
  } catch (error) {
    next(error);
  }
});

//Export Router
module.exports = router;
