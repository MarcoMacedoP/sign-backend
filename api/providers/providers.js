//External libs
const express = require("express");
const router = express.Router();
const debug = require("debug")("app:api:providers");
//Utils
const { sendGoodResponse } = require("../../utils/responses")
const { extractUserFromJWT } = require("../../utils/extractJwt")
//Services
const ProvidersServices = require("../../services/providers/providers");
//JWT strategy

//Extract JWT
const { extractJwt } = require("../../utils/extractJwt");

router.get("/", async (req, res, next) => {
  try {
    const { sub: userId } = extractJwt(req); //Extract sub from JWT and store it as userId
    const providersServices = new ProvidersServices();
    const providers = await providersServices.getAll({ userId });
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


router.post("/", async (req, res, next) =>{
  try{
      const { body } = req
      const userId = extractUserFromJWT(req)
      const data = {...body, userId}
      const providersServices = new ProvidersServices()
      const addedProvider = await providersServices.createOne(data)
      debug(addedProvider)
      sendGoodResponse({res,data:addedProvider})
  }catch(error){
    next(error)
  }
})

router.patch("/:providerId", async (req, res, next) => {
  try {
    const { providerId } = req.params;
    const data = req.body;
    const providersServices = new ProvidersServices();
    const result = await providersServices.update({
      providerId,
      data
    });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});
router.delete("/:providerId", async (req, res, next) => {
  try {
    const { providerId } = req.params;
    const providersServices = new ProvidersServices();
    const result = await providersServices.remove({
      providerId
    });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});
module.exports = router;
