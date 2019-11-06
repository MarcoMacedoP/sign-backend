const MongoLib = require("../../lib/mongodb");
const ClientsServices = require("../clients/clients");
const ProviderServices = require("../providers/providers");
class Projects {
  constructor() {
    this.mongodb = new MongoLib("projects");
  }
  //Gets a project with all the project info.
  getProjectWithFullInfo(query = {}) {
    return this.getOneWithCustumQuery(query).then(async project => {
      const {clients = [], providers = []} = project;
      //instance all services
      const clientServices = new ClientsServices();
      const providerServices = new ProviderServices();
      //convert the object into an array with just the values
      const clientsIds = clients.map(({clientId}) => clientId);
      const providerIds = providers.map(({providerId}) => providerId);
      try {
        const clientsInProject = await clientServices.getMany(
          clientsIds
        );
        const providersInProject = await providerServices.getMany(
          providerIds
        );
        return {
          ...project,
          clients: clientsInProject,
          providers: providersInProject
        };
      } catch (error) {
        return {...project, clients: [], providers: []};
      }
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
