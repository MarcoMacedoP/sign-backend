const TeamsServices = require("../teams/teams");
const MongoLib = require("../../lib/mongodb");
class TeamsProjects {
  projectsCollection() {
    return new MongoLib("projects");
  }
  getProjectTeams(teamsIds = []) {
    const teamsServices = new TeamsServices();
    return teamsServices.getMany(teamsIds);
  }
  addTeamToProject(teamId, projectId) {
    return this.projectsCollection().updateOneById(
      projectId,
      {
        teams: { teamId }
      },
      "$addToSet"
    );
  }
  removeTeamInProject(teamId, projectId) {
    return this.projectsCollection().updateOneById(
      projectId,
      {
        teams: { teamId }
      },
      "$pull"
    );
  }
}
module.exports = TeamsProjects;
