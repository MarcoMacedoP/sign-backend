const TeamsRemindersServices = require("../../services/teams/teams-reminders");
const router = require("express").Router();
const { sendGoodResponse } = require("../../utils/responses");

router.get("/:teamId", async (req, res, next) => {
  const teamsRemindersServices = new TeamsRemindersServices();
  const { teamId } = req.params;
  try {
    const reminders = await teamsRemindersServices.getRemindersOfATeam({
      teamId
    });
    sendGoodResponse({
      response: res,
      message: "get all reminders in team",
      statusCode: 200,
      data: reminders
    });
  } catch (error) {
    next(error);
  }
});
router.post("/:teamId", async (req, res, next) => {
  const { teamId } = req.params;
  const { reminderId } = req.body;
  const teamsRemindersServices = new TeamsRemindersServices();
  try {
    const reminders = await teamsRemindersServices.addReminderToTeam({
      teamId,
      reminderId
    });

    sendGoodResponse({
      response: res,
      message: "added reminders in team",
      statusCode: 201,
      data: reminders
    });
  } catch (error) {
    next(error);
  }
});
router.delete("/:teamId", async (req, res, next) => {
  const { teamId } = req.params;
  const { reminderId } = req.body;
  const teamsRemindersServices = new TeamsRemindersServices();
  try {
    const reminders = await teamsRemindersServices.removeReminderOfTeam({
      teamId,
      reminderId
    });
    sendGoodResponse({
      response: res,
      message: "removed reminder of team",
      statusCode: 200,
      data: reminders
    });
  } catch (error) {
    next(error);
  }
});
module.exports = router;
