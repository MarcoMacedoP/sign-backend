const TeamsServices = require("./teams");
const TeamsUserServices = require("./teams-users");

class TeamsFounderServices {
  constructor() {
    this.collection = () => new TeamsServices();
    this.teamsUsersCollection = () => new TeamsUserServices();
  }
  //create a filter(object) to filter in teams by teamId and checks if user is the team founder.
  checkIfUserIsFounderInProject({ userId, teamId }) {
    return this.teamsUsersCollection().findFounderInProject({
      founderId: userId,
      teamId
    });
  }
  deleteTeam(founderId, teamId) {
    return this.checkIfUserIsFounderInProject({
      userId: founderId,
      teamId
    }).then(() => this.collection().removeById({ teamId }));
  }
  addAdmin({ founderId, teamId, userIdToBeAdmin }) {
    return this.checkIfUserIsFounderInProject({
      userId: founderId,
      teamId
    }).then(() =>
      this.teamsUsersCollection().updateMemberToAdmin({
        teamId,
        userId: userIdToBeAdmin
      })
    );
  }
  removeAdmin({ founderId, teamId, adminIdToBeRemoved }) {
    return this.checkIfUserIsFounderInProject({
      userId: founderId,
      teamId
    }).then(() =>
      this.teamsUsersCollection().updateAdminToMember({
        teamId,
        userId: adminIdToBeRemoved
      })
    );
  }
}
module.exports = TeamsFounderServices;
