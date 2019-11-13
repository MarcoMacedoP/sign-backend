//libs

const TeamsServices = require("./teams");
const MembersTeamsServices = require("./teams-users");
const debug = require("debug")("app:services:teams-admins");

class TeamsAdminsServices {
  constructor() {
    this.membersCollection = () => new MembersTeamsServices();
    this.collection = () => new TeamsServices();
  }

  /**Checks if a determinate user is an admin of a deteminate team.
   * @param {ObjectId} teamId the teamID
   * @param {Number} userId the userId to check if is an admin.
   */
  checkIfUserIsAdmin({teamId, userId}) {
    return this.membersCollection().findAdminInProject({
      adminId: userId,
      teamId
    });
  }

  updateTeam({adminId, teamId, data}) {
    return this.checkIfUserIsAdmin({userId: adminId, teamId}).then(() =>
      this.collection().updateOne(teamId, data)
    );
  }

  /**
   * Adds a member to a team, first checks if the admin is in team, if is in, then add the member
   * @param {*} adminId
   * @param {*} teamId
   * @param {*} userId
   */
  addUserToTeam({adminId, teamId, userId}) {
    debug(adminId, teamId, userId);
    return this.checkIfUserIsAdmin({teamId, userId: adminId}).then(() =>
      this.membersCollection().addUserToTeamAsMember({
        teamId,
        userId
      })
    );
  }
  /**Removes a user of a team only is is a member
   *
   * @param {*} adminId
   * @param {*} teamId
   * @param {*} userId
   */
  removeMemberOfATeam({adminId, teamId, userId}) {
    return this.checkIfUserIsAdmin({teamId, userId: adminId}).then(() =>
      this.membersCollection().removeMemberOfTeam({
        teamId,
        userId
      })
    );
  }
}

module.exports = TeamsAdminsServices;
