const ReminderServices = require("../reminders/reminders");
const MongoLib = require("../../lib/mongodb");

function getProjectReminders(teamsIds = []) {
  const remindersServices = new ReminderServices();
  return remindersServices.getMany(teamsIds);
}
function addReminderToProject(teamId, projectId) {
  const projectsCollection = new MongoLib("projects");
  return projectsCollection.updateOneById(
    projectId,
    {
      teams: {teamId}
    },
    "$addToSet"
  );
}
function removeReminderInProject(teamId, projectId) {
  const projectsCollection = new MongoLib("projects");
  return projectsCollection.updateOneById(
    projectId,
    {
      teams: {teamId}
    },
    "$pull"
  );
}

module.exports = {
  getProjectReminders,
  addReminderToProject,
  removeReminderInProject
};
