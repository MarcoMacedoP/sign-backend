//modules
const express = require("express");
const router = express.Router();
const boom = require("@hapi/boom");
//services
const RemindersServices = require("../../services/reminders/reminders");
//schemas
const validate = require("../../utils/middlewares/validationHandler");
const { createReminderSchema } = require("../../utils/schemas/reminders");
//The routes ------------------------
router.get("/", async (req, res, next) => {
  //get all reminders.
});
router.post("/", validate(createReminderSchema), async (req, res, next) => {
  //create one reminder.
  const reminderData = req.body;
  const remindersServices = new RemindersServices();
  try {
    const { createdReminder } = await remindersServices.createOne(reminderData);
    res.status(200).json(createdReminder);
  } catch (error) {
    next(error);
  }
});
router.get("/:reminderId", async (req, res, next) => {
  //get one reminder by id.
});
router.patch("/:reminderId", async (req, res, next) => {
  //update one reminder by id.
});
router.delete("/:reminderId", async (req, res, next) => {
  //delete one reminder by id.
});

//export
module.exports = router;
