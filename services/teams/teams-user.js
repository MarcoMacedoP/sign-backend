//libs
const debug = require("debug")("app:services:team-users");
const Boom = require("@hapi/boom");

const TeamsServices = require("./teams");
const {ObjectId} = require("mongodb");

function checkIfUserExists(users = [], newUser = {}) {
  if (!users || !newUser) {
    return {
      userPosition: -1,
      userIsInTeam: false
    };
  } else {
    const searchResult = users.findIndex(
      user => user.id === newUser.id
    );

    return {
      userPosition: searchResult,
      userIsInTeam: searchResult === -1 ? false : true
    };
  }
}
class TeamsUserServices extends TeamsServices {
  constructor() {
    super();
    this.errors = {
      userNotFound: Boom.notFound("user isn't in team!"),
      userAlreadyInTeam: Boom.badRequest("user already in team!")
    };
  }

  /**
   * Get's all the teams that a user haves.
   * @param {Number} userId
   */
  getAll(userId) {
    return this.mongodb.readAll({admin: userId});
  }
  /**
   * Get one team that a user haves.
   * @param {Number} userId the user id to be searched.
   * @param {String} teamId the mongoId for the team.
   */
  getOne(userId, teamId) {
    return this.mongodb.readOne({
      _id: new ObjectId(teamId),
      admin: userId
    });
  }
  /**
   * remove one team that a user haves.
   * @param {Number} userId the user id to be searched.
   * @param {String} teamId the mongoId for the team.
   */
  removeOne(userId, teamId) {
    return this.mongodb.removeOne({
      _id: new ObjectId(teamId),
      admin: userId
    });
  }
  /**
   * update one team that a user haves.
   * @param {Number} userId the user id to be searched.
   * @param {String} teamId the mongoId for the team.
   * @param {Object} data the data to be added
   */
  updateOne(userId, teamId, data) {
    return this.mongodb.updateOne(
      {
        _id: new ObjectId(teamId),
        admin: userId
      },
      data
    );
  }
  /**
   * Add a user to the team.
   * Checks if user already exists on team, if not then added,
   * else just return the team info
   * @param {Number} userId the user id to request to add a member
   * @param {String} teamId the mongoId for the team.
   * @param {Object} userToBeAdded the user data to be added
   * @return {Promise} that will add the user to the team or not.
   */
  addUserToTeam(teamId, userId, userToBeAdded) {
    return this.getOne(userId, teamId).then(team => {
      if (team.users) {
        const {userIsInTeam} = checkIfUserExists(
          team.users,
          userToBeAdded
        );
        if (!userIsInTeam) {
          return this.updateOne(userId, teamId, {
            users: [...team.users, userToBeAdded]
          });
        } else {
          throw this.errors.userAlreadyInTeam;
        }
      } else {
        return this.updateOne(userId, teamId, {
          users: [userToBeAdded]
        });
      }
    });
  }
  removeUserFromTeam(teamId, adminId, userId) {
    return this.getOne(adminId, teamId).then(team => {
      const {userIsInTeam} = checkIfUserExists(team.users, {
        id: userId
      });
      if (userIsInTeam) {
        const updatedUsers = team.users.filter(
          user => user.id !== userId
        );
        debug(updatedUsers);
        return this.updateOne(adminId, teamId, {
          users: updatedUsers
        });
      } else throw this.errors.userNotFound;
    });
  }
}

module.exports = TeamsUserServices;
