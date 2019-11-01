//libs and modules
const router = require("express").Router();
const UserNotificationsServices = require("../../services/notifications/user-notifications");
//utils
const {getUserIDFromAccessToken} = require("../../utils/extractJwt");
const {sendGoodResponse} = require("../../utils/responses");

router.get("/", async (req, res, next) => {
  try {
    const userId = getUserIDFromAccessToken(req);
    const userNotificationServices = new UserNotificationsServices(
      userId
    );
    const userNotifications = await userNotificationServices.getAll();
    sendGoodResponse({
      response: res,
      message: "get all user notifications",
      data: userNotifications
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
