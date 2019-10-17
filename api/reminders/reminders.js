//modules
const express = require("express");
const router = express.Router();
const debug = require("debug")("app:reminders-api");
//services
const RemindersServices = require("../../services/reminders/reminders");
//schemas
const validate = require("../../utils/middlewares/validationHandler");
const {
  createReminderSchema,
  createReminderNotFromUser
} = require("../../utils/schemas/reminders");
//utils
const {sendGoodResponse} = require("../../utils/responses");
const {getUserIDFromAccessToken} = require("../../utils/extractJwt");
//get all reminders that a user haves.
router.get("/", async (request, response, next) => {
  const userId = getUserIDFromAccessToken(request);
  const reminders = new RemindersServices();
  const {searchedType, searchedTypeId} = request.query;
  const sendReminders = reminders =>
    sendGoodResponse({
      response,
      message: "get reminders :)",
      statusCode: 200,
      data: reminders
    });
  if (searchedType && searchedTypeId) {
    try {
      const searchedReminders = await reminders.getAllNotFromUser(
        searchedType.toUpperCase(),
        searchedTypeId
      );
      sendReminders(searchedReminders);
    } catch (error) {
      next(error);
    }
  } else {
    try {
      const userReminders = await reminders.getAllFromUser(userId);
      sendReminders(userReminders);
    } catch (error) {
      next(error);
    }
  }
});
//create one reminder for a user
router.post(
  "/",
  validate(createReminderSchema),
  async (request, response, next) => {
    const userId = getUserIDFromAccessToken(request);
    const remindersServices = new RemindersServices();
    try {
      const createdReminder = await remindersServices.createOne({
        ...request.body,
        userId
      });
      sendGoodResponse({
        response,
        message: "create a reminder",
        statusCode: 200,
        data: createdReminder
      });
    } catch (error) {
      next(error);
    }
  }
);
//create one reminder for a project, team, etc..
router.post(
  "/:type",
  validate(createReminderNotFromUser),
  async (request, response, next) => {
    const {type} = request.params;
    const reminders = new RemindersServices();
    const userId = getUserIDFromAccessToken(request);
    try {
      const reminder = await reminders.createNotFromUser(
        type.toUpperCase(),
        {
          ...request.body,
          userId
        }
      );
      debug(reminder);
      sendGoodResponse({
        response,
        message: "created reminder",
        statusCode: 200,
        data: reminder
      });
    } catch (error) {
      next(error);
    }
  }
);
router.get("/:reminderId", async (request, response, next) => {
  //get one reminder by id.
  const remindersServices = new RemindersServices();
  const {reminderId} = request.params;
  try {
    const reminder = await remindersServices.getOne(reminderId);
    sendGoodResponse({
      response,
      message: "get a reminder",
      statusCode: 200,
      data: reminder
    });
  } catch (error) {
    next(error);
  }
});
router.patch("/:reminderId", async (request, response, next) => {
  //update one reminder by id.
  const remindersServices = new RemindersServices();
  const {reminderId} = request.params;
  const {title, description, date} = request.body;

  try {
    const updatedReminder = await remindersServices.updateOne({
      reminderId,
      title,
      description,
      date
    });
    //************* update message response *******************
    sendGoodResponse({
      response,
      message: "get a reminder",
      statusCode: 200,
      data: reminders
    });
  } catch (error) {
    next(error);
  }
});
router.delete("/:reminderId", async (request, response, next) => {
  //delete one reminder by id.
  const remindersServices = new RemindersServices();
  const {reminderId} = request.params;
  try {
    const removedReminder = await remindersServices.remove(
      reminderId
    );
    //************* update message response *******************
    sendGoodResponse({
      response,
      message: "get a reminder",
      statusCode: 200,
      data: reminders
    });
  } catch (error) {
    next(error);
  }
});

//export
module.exports = router;
