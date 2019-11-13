const router = require("express").Router();
//services
const ReminderServices = require("../../services/projects/reminders-projects");
//validation
const validate = require("../../utils/middlewares/validationHandler");
const {
  addReminderToProjectSchema,
  removeReminderInProjectSchema
} = require("../../utils/schemas/projects/reminders-projects");
//utils
const { sendGoodResponse } = require("../../utils/responses");
//*********************endpoints**************************/
//add reminder to project
router.post(
  "/",
  validate(addReminderToProjectSchema),
  async (req, res, next) => {
    const { projectId, reminderId } = req.body;
    const reminderServices = new ReminderServices();
    try {
      const project = await reminderServices.addReminderToProject(
        reminderId,
        projectId
      );
      sendGoodResponse({
        response: res,
        data: project,
        statusCode: 201,
        message: "added reminder to project"
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);
//remove reminder to project
router.delete(
  "/",
  validate(removeReminderInProjectSchema),
  async (req, res, next) => {
    const { projectId, reminderId } = req.body;
    const reminderServices = new ReminderServices();
    try {
      const project = await reminderServices.removeReminderInProject(
        reminderId,
        projectId
      );
      sendGoodResponse({
        response: res,
        data: project,
        statusCode: 201,
        message: "removed reminder to project"
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
