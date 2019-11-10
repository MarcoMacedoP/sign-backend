const remindersServices = require("../reminders/index");
const MongoLib = require("../../lib/mongodb");

function getProjectReminders(remindersIds = []) {
  return remindersServices.findInArray(remindersIds);
}
function addReminderToProject(reminderId, projectId) {
  const projectsCollection = new MongoLib("projects");
  return projectsCollection.updateOneById(
    projectId,
    {
      reminders: {reminderId}
    },
    "$addToSet"
  );
}
function removeReminderInProject(reminderId, projectId) {
  const projectsCollection = new MongoLib("projects");
  return projectsCollection.updateOneById(
    projectId,
    {
      remidners: {reminderId}
    },
    "$pull"
  );
}

module.exports = {
  getProjectReminders,
  addReminderToProject,
  removeReminderInProject
};
