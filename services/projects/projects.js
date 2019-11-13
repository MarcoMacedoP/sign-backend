const MongoLib = require("../../lib/mongodb");
const { ObjectId } = require("mongodb");
const ClientsServices = require("../clients/clients");
const ProviderServices = require("../providers/providers");
const ProjectServices = require("./projects-teams");
const RemindersProjectsServices = require("./reminders-projects");
const debug = require("debug")("app:services:projects");

class Projects {
  collection() {
    return new MongoLib("projects");
  }
  getOneWithCustumQuery(query) {
    return this.collection().readOne(query);
  }
  createOne(data) {
    return this.collection().createOne(data);
  }
  getOneById(projectId) {
    return this.collection().readById(projectId);
  }
  getAll(query = {}) {
    return this.collection().readAll(query);
  }
  updateOne(filter = {}, newData = {}) {
    return this.collection().updateOne(filter, newData);
  }
  updateOneById(projectId, newData) {
    return this.collection()
      .updateOneById(projectId, newData)
      .then(() =>
        this.getProjectWithFullInfo({ _id: new ObjectId(projectId) })
      );
  }
  removeOne(filter = {}) {
    return this.collection().removeOne(filter);
  }
  removeOneById(objectId) {
    return this.collection().removeOneById(objectId);
  }
  //Gets a project with all the project info.
  getProjectWithFullInfo(query = {}) {
    return this.getOneWithCustumQuery(query).then(async (project = {}) => {
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
      const projectServices = new ProjectServices();
      const providerServices = new ProviderServices();
      const reminderProjectsServices = new RemindersProjectsServices();
      //convert the object into an array with just the values
      const clientsIds = clients.map(({ clientId }) => clientId);
      const providerIds = providers.map(({ providerId }) => providerId);
      const teamsIds = teams.map(({ teamId }) => teamId);
      const remindersIds = reminders.map(({ reminderId }) => reminderId);
      //get data from services
      const clientsInProject = await clientServices.getMany(clientsIds);
      const providersInProject = await providerServices.getMany(providerIds);
      const teamsInProject = await projectServices.getProjectTeams(teamsIds);
      const remindersInProject = await reminderProjectsServices.getProjectReminders(
        remindersIds
      );
      return {
        ...project,
        clients: clientsInProject || [],
        providers: providersInProject || [],
        teams: teamsInProject || [],
        reminders: remindersInProject || []
      };
    });
  }
}
module.exports = Projects;
