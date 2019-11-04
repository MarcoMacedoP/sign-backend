const MongoLib = require("../../lib/mongodb");
const ClientsServices = require("../clients/clients");
class Projects {
  constructor() {
    this.mongodb = new MongoLib("projects");
  }
  //Gets a project with all the project info.
  getProjectWithFullInfo(query = {}) {
    return this.getOneWithCustumQuery(query).then(async project => {
      const clientServices = new ClientsServices();
      //convert the object into an array with just the values
      const clientsIds = project.clients.map(
        ({clientId}) => clientId
      );
      const clientsInProject = await clientServices.getMany(
        clientsIds
      );
      return {
        ...project,
        clients: clientsInProject
      };
    });
  }
  getOneWithCustumQuery(query) {
    return this.mongodb.readOne(query);
  }
  createOne(data) {
    return this.mongodb.createOne(data);
  }
  getOneById(projectId) {
    return this.mongodb.readById(projectId);
  }
  getAll(query = {}) {
    return this.mongodb.readAll(query);
  }
  updateOne(filter = {}, newData = {}) {
    return this.mongodb.updateOne(filter, newData);
  }
  updateOneById(projectId, newData) {
    return this.mongodb.updateOneById(projectId, newData);
  }
  removeOne(filter = {}) {
    return this.mongodb.removeOne(filter);
  }
  removeOneById(objectId) {
    return this.mongodb.removeOneById(objectId);
  }
}
module.exports = Projects;
