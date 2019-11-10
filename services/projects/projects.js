const MongoLib = require("../../lib/mongodb");
const {ObjectId} = require("mongodb");
const ClientsServices = require("../clients/clients");
const ProviderServices = require("../providers/providers");
const {getProjectTeams} = require("./teams-projects");
const {getProjectReminders} = require("./reminders-projects");
const debug = require("debug")("app:services:projects");

class Projects {
  constructor() {
    this.mongodb = new MongoLib("projects");
  }
  //Gets a project with all the project info.
  getProjectWithFullInfo(query = {}) {
    return this.getOneWithCustumQuery(query).then(
      async (project = {}) => {
        if (!project) {
          return [];
        }
        const {
          clients = [],
          providers = [],
          teams = [],
          reminders = []
        } = project;
        debug(clients, providers, teams, reminders);
        //instance all services
        const clientServices = new ClientsServices();
        const providerServices = new ProviderServices();
        //convert the object into an array with just the values
        const clientsIds = clients.map(({clientId}) => clientId);
        const providerIds = providers.map(
          ({providerId}) => providerId
        );
        const teamsIds = teams.map(({teamId}) => teamId);
        const remindersIds = reminders.map(
          ({reminderId}) => reminderId
        );
        const clientsInProject = await clientServices.getMany(
          clientsIds
        );
        const providersInProject = await providerServices.getMany(
          providerIds
        );
        const teamsInProject = await getProjectTeams(teamsIds);
        const remindersInProject = await getProjectReminders(
          remindersIds
        );
        return {
          ...project,
          clients: clientsInProject || [],
          providers: providersInProject || [],
          teams: teamsInProject || [],
          reminders: remindersInProject || []
        };
      }
    );
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
    return this.mongodb
      .updateOneById(projectId, newData)
      .then(() =>
        this.getProjectWithFullInfo({_id: new ObjectId(projectId)})
      );
  }
  removeOne(filter = {}) {
    return this.mongodb.removeOne(filter);
  }
  removeOneById(objectId) {
    return this.mongodb.removeOneById(objectId);
  }
}
module.exports = Projects;
