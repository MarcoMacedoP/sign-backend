const TeamsServices = require("./teams");
const TeamsUsersServices = require("./teams-users");
const debug = require("debug")("app:services:teams-members");
class TeamsMembersServices {
  constructor() {
    this.collection = () => new TeamsServices();
    this.teamsUsersCollection = () => new TeamsUsersServices();
  }

  async getAll(userId) {
    const teams = await this.teamsUsersCollection().getAllTeamsOfUser({userId});
    debug(teams);
    const teamsPromises = teams.map(
      team => team && team.teamId && this.getOne(team.teamId)
    );
    return Promise.all(teamsPromises);
  }
  getOne(teamId) {
    return this.collection()
      .getOneById(teamId)
      .then();
  }
  insertOne(userId, teamData) {
    return this.collection().createOne({teamData, founderId: userId});
  }
}
module.exports = TeamsMembersServices;
