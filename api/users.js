//Dependencies and resources
const express = require("express");
const router = express.Router();
const debug = require("debug")("app:api:users");
//Services
const UserServices = require("../services/users");

//Single user requests
router.get("/:userId", async (req, res, next) => {
  try {
    const { userId } = req.params;
    const userServices = new UserServices();
    const user = await userServices.getByID({ userId });
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});
router.patch("/:userId", async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { profilePic, location, biography } = req.body;

    const userServices = new UserServices();
    const user = await userServices.addAditionalInfo({
      userId,
      profilePic,
      location,
      biography
    });
    console.log(user);
    res.status(200).json({ userId, message: "Información agregada" });
  } catch (error) {
    next(error);
  }
});
router.get("/email/:email", async (req, res, next) => {
  try {
    const { email } = req.params;
    const userServices = new UserServices();
    const user = await userServices.getByEmail({ email });
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
