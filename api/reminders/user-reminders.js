const router = require("express").Router();
const userReminders = require("../../services/reminders/user-reminders");
//utils
const {sendGoodResponse} = require("../../utils/responses");
const {getUserIDFromAccessToken} = require("../../utils/extractJwt");
//validate
const {
  createReminderSchema,
  reminderIdSchema,
  reminderSchema
} = require("../../utils/schemas/reminders/user-reminders");
const validate = require("../../utils/middlewares/validationHandler");

router.get("/", async function(req, res, next) {
  const userID = getUserIDFromAccessToken(req);
  try {
    const reminders = await userReminders.findAll(userID);
    sendGoodResponse({
      response: res,
      message: "get reminders :)",
      statusCode: 200,
      data: reminders
    });
  } catch (error) {
    next(error);
  }
});

router.post(
  "/",
  validate(createReminderSchema),
  async (req, res, next) => {
    const userID = getUserIDFromAccessToken(req);
    try {
      const reminder = await userReminders.insertOne(
        userID,
        req.body
      );
      sendGoodResponse({
        response: res,
        message: "get reminders :)",
        statusCode: 200,
        data: reminder
      });
    } catch (error) {
      next(error);
    }
  }
);
router.get(
  "/:reminderId",
  validate(reminderIdSchema, "params"),
  async (req, res, next) => {
    const userID = getUserIDFromAccessToken(req);
    const {reminderId} = req.params;
    try {
      const reminder = await userReminders.findOne(
        userID,
        reminderId
      );
      sendGoodResponse({
        response: res,
        message: "get reminders :)",
        statusCode: 200,
        data: reminder
      });
    } catch (error) {
      next(error);
    }
  }
);
router.put(
  "/:reminderId",
  validate(reminderIdSchema, "params"),
  validate(reminderSchema),
  async function(req, res, next) {
    const userID = getUserIDFromAccessToken(req);
    const {reminderId} = req.params;
    try {
      const reminder = await userReminders.updateOne(
        userID,
        reminderId,
        req.body
      );
      sendGoodResponse({
        response: res,
        message: "get reminders :)",
        statusCode: 201,
        data: reminder
      });
    } catch (error) {
      next(error);
    }
  }
);
router.delete(
  "/:reminderId",
  validate(reminderIdSchema, "params"),
  async function(req, res, next) {
    const userID = getUserIDFromAccessToken(req);
    const {reminderId} = req.params;
    try {
      const reminder = await userReminders.removeOne(
        userID,
        reminderId
      );
      sendGoodResponse({
        response: res,
        message: "get reminders :)",
        statusCode: 201,
        data: reminder
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
