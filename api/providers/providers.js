//Dependencies and resources
const express = require("express");
const router = express.Router();
const debug = require("debug")("app:api:providers");
const {sendGoodResponse} = require("../../utils/responses");
//Services
const ProvidersServices = require("../../services/providers/providers");
//Extract JWT
const {extractJwt} = require("../../utils/extractJwt");

router.get("/", async (req, res, next) => {
  try {
    const {sub: userId} = extractJwt(req); //Extract sub from JWT and store it as userId
    const providersServices = new ProvidersServices();
    const providers = await providersServices.getAll({userId});
    sendGoodResponse({
      response: res,
      message: "getted provider",
      statusCode: 200,
      data: providers
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:providerId", async (req, res, next) => {
  try {
    const {providerId} = req.params;
    const providersServices = new ProvidersServices();
    const provider = await providersServices.getOne({providerId});
    sendGoodResponse({
      response: res,
      message: "getted provider",
      statusCode: 200,
      data: provider
    });
  } catch (error) {
    next(error);
  }
});
router.post("/", async (req, res, next) => {
  try {
    const {sub: userId} = extractJwt(req);
    const provider = Object.keys(req.body).map(key => req.body[key]);
    const providersServices = new ProvidersServices();
    const createdProvider = await providersServices.create(
      provider,
      userId
    );

    sendGoodResponse({
      response: res,
      message: "created provider",
      statusCode: 200,
      data: createdProvider
    });
  } catch (error) {
    next(error);
  }
});
router.put("/:providerId", async (req, res, next) => {
  try {
    const {providerId} = req.params;
    debug(typeof providerId);
    const providersServices = new ProvidersServices();
    const provider = await providersServices.update(
      providerId,
      req.body
    );
    sendGoodResponse({
      response: res,
      message: "updated provider",
      statusCode: 201,
      data: provider
    });
  } catch (error) {
    debug(error);
    next(error);
  }
});
router.delete("/:providerId", async (req, res, next) => {
  try {
    const {providerId} = req.params;
    const providersServices = new ProvidersServices();
    await providersServices.remove({
      providerId
    });
    sendGoodResponse({
      response: res,
      message: "deleted provider",
      statusCode: 203
    });
  } catch (error) {
    next(error);
  }
});
module.exports = router;
