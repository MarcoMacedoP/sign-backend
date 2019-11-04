const ProjectServices = require("./projects");
const ClientsServices = require("../clients/clients");
const Boom = require("@hapi/boom");
// const debug = require("debug")("app:services:clients-projects");
class ClientsProjects {
  constructor(projectId) {
    this.projects = new ProjectServices();
    this.clients = new ClientsServices();
    this.projectId = projectId;
  }
  getProjectClients() {
    return this.projects.getOneById(this.projectId).then(project => {
      const {clients = []} = project;
      return this.clients
        .getMany(clients)
        .then(clientsWithFullInfo => {
          return {...project, clients: clientsWithFullInfo};
        });
    });
  }
  /**Add a client into a project using their clientId. First checks
   *  if client is already added an then if isn't in project added to it.
   * @param {*} clientId the cliend id.
   * @throws Boom.badRequest if client is added.
   * @returns {Promise} with the added client to project
   */

  addClient(clientId) {
    //findClientInProject() throws an Boom.notFound
    // if doesn't found client in project we added on .catch
    //first we check the boom status code.
    return this.findClientInProject(clientId)
      .then(client => {
        throw Boom.badRequest("Client is already added", client);
      })
      .catch(error => {
        if (Boom.isBoom(error) && error.output.statusCode === 404) {
          return this.projects
            .getOneById(this.projectId)
            .then(({clients = []}) =>
              this.projects.updateOneById(this.projectId, {
                clients: [{clientId}, ...clients]
              })
            );
        } else throw error;
      });
  }

  /**Add a client into a project using their clientId.
   * @param {*} clientId the cliend id.
   */
  removeClient(clientId) {
    return this.projects
      .getOneById(this.projectId)
      .then(({clients}) => {
        const filteredClients = clients.filter(
          client => client.clientId !== clientId
        );
        return this.projects.updateOneById(this.projectId, {
          clients: filteredClients
        });
      });
  }
  findClientInProject(clientId) {
    return this.projects
      .getOneById(this.projectId)
      .then(({clients}) => {
        const [findedClientById] = clients.filter(
          client => client.clientId === clientId
        );
        if (findedClientById) {
          return findedClientById;
        } else {
          throw Boom.notFound("Client isn't in project");
        }
      });
  }
}

module.exports = ClientsProjects;
