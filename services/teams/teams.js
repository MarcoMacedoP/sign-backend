const MongoLib = require("../../lib/mongodb");
const { ObjectId } = require("mongodb");
const TeamsUsersServices = require("./teams-users");
const debug = require("debug")("app:services:teams");

class Teams {
  constructor() {
    this.collection = () => new MongoLib("teams");
    this.membersCollection = () => new TeamsUsersServices();
  }

  async createOne({ teamData, founderId }) {
    const team = await this.collection().createOne(teamData);
    const members = await this.membersCollection().addUserToTeamAsFounder({
      teamId: team._id,
      userId: founderId
    });

    return {
      ...team,
      members: [members]
    };
  }

  removeById({ teamId }) {
    return this.collection()
      .removeOneById(teamId)
      .then(({ deletedCount }) => ({ deletedCount, teamId }));
  }

  updateOne(teamId, data, extraFilter = {}, operator = "") {
    debug(teamId);
    const filter = { _id: new ObjectId(teamId), ...extraFilter };
    debug("updateOne() filter:", filter);
    return this.collection().updateOne(filter, data, operator);
  }
  getMany(arrayOfIds = []) {
    return this.collection().readAll({
      _id: { $in: arrayOfIds.map(id => new ObjectId(id)) }
    });
  }
  getOne(filter) {
    debug(filter);
    return this.collection()
      .readOne(filter)
      .then(async team => {
        debug(team);
        if (!team) {
          return null;
        }
        const membersInTeam = await this.membersCollection().getAllUsersInTeam({
          teamId: team._id
        });
        debug(membersInTeam);
        return {
          ...team,
          members: membersInTeam
        };
      });
  }
  getOneById(teamId, extraFilter = {}) {
    const filter = {
      _id: new ObjectId(teamId),
      ...extraFilter
    };
    return this.getOne(filter);
  }
}

module.exports = Teams;
