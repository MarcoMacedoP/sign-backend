const ReminderServices = require("../reminders/reminders");
const MongoLib = require("../../lib/mongodb");
class RemindersProjects {
  projectsCollection() {
    return new MongoLib("projects");
  }
  getProjectReminders(remindersIds = []) {
    return new ReminderServices().findInArray(remindersIds);
  }
  addReminderToProject(reminderId, projectId) {
    return this.projectsCollection().updateOneById(
      projectId,
      {
        reminders: { reminderId }
      },
      "$addToSet"
    );
  }
  removeReminderInProject(reminderId, projectId) {
    return this.projectsCollection()
      .updateOneById(
        projectId,
        {
          reminders: { reminderId }
        },
        "$pull"
      )
      .then(() => ({ removedReminder: reminderId, projectId }));
  }
}
module.exports = RemindersProjects;
