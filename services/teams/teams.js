const MongoLib = require("../../lib/mongodb");
const {ObjectId} = require("mongodb");
const debug = require("debug")("app:services:teams");
class Teams {
  constructor() {
    this.mongodb = new MongoLib("teams");
  }
  /**
   * Create a team
   *
   * @param {String} name the name of the team
   * @param {String} description the description of the team
   * @param {String} picture the URL of the picture of the team
   * @param {String} userId the userId to be used for have admin permissions
   * @param {Array} projects the projectsId's to be assigned to team
   * @param {Array} clients the clientsId's to be assigned to team
   * @param {Array} providers the providersId's to be assigned to team
   *
   */
  createOne({
    name,
    description,
    picture,
    userId,
    projects = [],
    clients = [],
    providers = []
  }) {
    return this.mongodb.createOne({
      name,
      description,
      picture,
      admin: userId,
      projects,
      clients,
      providers
    });
  }
  updateOne(teamId, data) {
    return this.mongodb.updateOneById(teamId, data);
  }
  getMany(arrayOfIds = []) {
    const arrayOfIdsInObjectId = arrayOfIds.map(
      id => new ObjectId(id)
    );
    debug(arrayOfIdsInObjectId);
    return this.mongodb.readAll({_id: {$in: arrayOfIdsInObjectId}});
  }
}
module.exports = Teams;
