const TeamsServices = require("../teams/teams");
const MongoLib = require("../../lib/mongodb");
// const debug = require("debug")("app:services:clients-projects");

function getProjectTeams(teamsIds = []) {
  const teamsServices = new TeamsServices();
  return teamsServices.getMany(teamsIds);
}
function addTeamToProject(teamId, projectId) {
  const projectsCollection = new MongoLib("projects");
  return projectsCollection.updateOneById(
    projectId,
    {
      teams: {teamId}
    },
    "$addToSet"
  );
}
function removeTeamInProject(teamId, projectId) {
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
  getProjectTeams,
  addTeamToProject,
  removeTeamInProject
};
