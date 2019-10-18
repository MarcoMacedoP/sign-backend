const TeamsServices = require("./teams");
const {ObjectId} = require("mongodb");

class TeamsUserServices extends TeamsServices {
  constructor() {
    super();
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
}
module.exports = TeamsUserServices;
