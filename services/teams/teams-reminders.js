const ReminderServices = require("../reminders/reminders");
const TeamsServices = require("./teams");
class TeamsRemindersServices {
  collection() {
    return new TeamsServices();
  }
  addReminderToTeam({ reminderId, teamId }) {
    const addToSet = {
      reminders: {
        reminderId
      }
    };
    return this.collection().updateOne(teamId, addToSet, null, "$addToSet");
  }
  removeReminderOfTeam({ reminderId, teamId }) {
    const pull = {
      reminders: {
        reminderId
      }
    };
    return this.collection().updateOne(teamId, pull, null, "$pull");
  }
  async getRemindersOfATeam({ teamId }) {
    const remindersServices = new ReminderServices();
    const { reminders = [] } = await this.collection().getOneById(teamId);
    //get just the value of the reminders
    const remindersIds = reminders.map(
      reminder => reminder.reminderId && reminder.reminderId
    );

    return remindersServices.findInArray(remindersIds);
  }
}
module.exports = TeamsRemindersServices;
