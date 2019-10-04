//Dependencies and resources
const express = require("express");
const router = express.Router();
const debug = require("debug")("app:api:users");
const fileUpload = require("../utils/middlewares/fileUpload");
const {
  sendBadResponse,
  sendGoodResponse
} = require("../utils/responses");
const config = require("../config");
//Services
const UserServices = require("../services/users");

//Single user requests
router.get("/:userId", async (req, res, next) => {
  try {
    const {userId} = req.params;
    const userServices = new UserServices();
    const user = await userServices.getByID({userId});
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});
//update user
router.put(
  "/:userId",
  fileUpload.single("profilePic"),
  async (req, res, next) => {
    debug(req.body);
    debug(req.params.userId);
    try {
      const profilePicUrl = `${config.serverUrl}/static/uploads/${req.file.filename}`;
      debug(profilePicUrl);
      const userServices = new UserServices();
      const updatedUser = await userServices.updateUser({
        ...req.body,
        profilePic: profilePicUrl,
        userId: req.params.userId
      });
      sendGoodResponse({
        response: res,
        statusCode: 201,
        data: updatedUser,
        message: "User updated"
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get("/email/:email", async (req, res, next) => {
  try {
    const {email} = req.params;
    const userServices = new UserServices();
    const user = await userServices.getByEmail({email});
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
