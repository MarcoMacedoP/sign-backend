const MongoLib = require("../../lib/mongodb");
const { ObjectId } = require("mongodb");
const Boom = require("@hapi/boom");
const debug = require("debug")("app:services:teams-users");
const UsersServices = require("../users");

class TeamsUsers {
  constructor() {
    this.filterByTeamId = teamId => ({ _id: new ObjectId(teamId) });
    this.collection = () => new MongoLib("members-teams");
    this.usersCollection = () => new UsersServices();

    this.memberRoles = {
      admin: "admin",
      member: "member",
      founder: "founder"
    };
  }
  getAllUsersInTeam({ teamId }) {
    return this.collection().readAll({
      teamId: new ObjectId(teamId)
    });
  }
  getAllTeamsOfUser({ userId }) {
    return this.collection().readAll({ userId });
  }

  /** Adds a member to a team.
   * @param {*} teamId the teamID
   * @param {*} userId the userId to be added
   */
  async addUserToTeam({ teamId, userId, role = this.memberRoles.member }) {
    const userData = await this.usersCollection().getFullNameAndProfilePicture({
      userId
    });

    return new Promise((resolve, reject) => {
      if (!userData) {
        reject(
          Boom.badRequest("User that are tried to be added does not exists.")
        );
      } else {
        resolve(
          this.collection().createOne({
            userId: parseInt(userId),
            teamId: new ObjectId(teamId),
            role,
            userName: userData.name,
            userPicture: userData.profilePic
          })
        );
      }
    });
  }
  addUserToTeamAsMember({ teamId, userId }) {
    return this.addUserToTeam({ teamId, userId });
  }
  addUserToTeamAsAdmin({ teamId, userId }) {
    return this.addUserToTeam({
      teamId,
      userId,

      role: this.memberRoles.admin
    });
  }
  addUserToTeamAsFounder({ teamId, userId }) {
    return this.addUserToTeam({
      teamId,
      userId,

      role: this.memberRoles.founder
    });
  }

  async findUserInProject({ userId, teamId, role }) {
    const adminInProject = await this.collection().readOne({
      userId,
      teamId: new ObjectId(teamId),
      role
    });
    debug(adminInProject);
    return new Promise((resolve, reject) =>
      adminInProject
        ? resolve(adminInProject)
        : reject(Boom.badRequest(`User is not an ${role} in team`))
    );
  }
  async findFounderInProject({ founderId, teamId }) {
    return this.findUserInProject({
      userId: founderId,
      teamId,
      role: this.memberRoles.founder
    });
  }
  async findAdminInProject({ adminId, teamId }) {
    return this.findUserInProject({
      userId: adminId,
      teamId,
      role: { $in: [this.memberRoles.admin, this.memberRoles.founder] }
    });
  }

  updateMemberRole({ newRole, userId, teamId }) {
    debug("updateMemberRole() arguments:", userId, teamId);
    return (
      this.collection()
        .updateOne(
          { teamId: new ObjectId(teamId), userId: parseInt(userId) },
          {
            role: newRole
          }
        )
        //if no result it means that user isn't in team, then added.
        .then(result =>
          result
            ? result
            : this.addUserToTeam({ teamId, userId, role: newRole })
        )
    );
  }

  updateMemberToAdmin({ teamId, userId }) {
    return this.updateMemberRole({
      newRole: this.memberRoles.admin,
      userId,
      teamId
    });
  }
  updateAdminToMember({ teamId, userId }) {
    return this.updateMemberRole({
      newRole: this.memberRoles.member,
      userId,
      teamId
    });
  }
  removeUserOfTeam({ teamId, userId, role }) {
    return this.collection()
      .removeOne({
        userId: parseInt(userId),
        teamId: new ObjectId(teamId),
        role
      })
      .then(({ deletedCount }) => ({ deletedCount, userId, teamId }));
  }
  removeMemberOfTeam({ teamId, userId }) {
    return this.removeUserOfTeam({
      teamId,
      userId,
      role: this.memberRoles.member
    });
  }
}

module.exports = TeamsUsers;
