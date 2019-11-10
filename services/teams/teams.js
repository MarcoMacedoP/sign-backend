const MongoLib = require("../../lib/mongodb");
const {ObjectId} = require("mongodb");

function Teams() {
  this.memberRoles = {
    admin: "admin",
    member: "member",
    founder: "founder"
  };
}
Teams.prototype._collection = function() {
  return new MongoLib("teams");
};
Teams.prototype.createOne = function(teamData) {
  return this._collection().createOne(teamData);
};
Teams.prototype.updateOne = function(teamId, data, extraFilter = {}) {
  return this._collection().updateOne(
    {_id: new ObjectId(teamId), ...extraFilter},
    data
  );
};
Teams.prototype.getMany = function(arrayOfIds = []) {
  return this._collection().readAll({
    _id: {$in: arrayOfIds.map(id => new ObjectId(id))}
  });
};
Teams.prototype.getOneById = function(teamId, extraFilter = {}) {
  return this._collection().readOne({
    _id: new ObjectId(teamId),
    ...extraFilter
  });
};

module.exports = Teams;
