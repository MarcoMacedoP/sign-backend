const TeamsServices = require("./teams");
class TeamsUserServices {
  _collection() {
    return new TeamsServices()._collection();
  }
  getAll(userId) {
    return this._collection().readAll({
      members: {$elemMatch: {userId}}
    });
  }
  getOne(userId, teamId) {
    console.log(userId);
    return new TeamsServices().getOneById(teamId, {
      members: {$elemMatch: {userId}}
    });
  }
  insertOne(userId, teamData) {
    return this._collection().createOne({
      ...teamData,
      members: [
        {
          role: new TeamsServices().memberRoles.founder,
          userId
        }
      ]
    });
  }
}
module.exports = TeamsUserServices;
