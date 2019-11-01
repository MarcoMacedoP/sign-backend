const ProjectServices = require("./projects");

class ClientsProjects {
  constructor(projectId) {
    this.projects = new ProjectServices();
    this.projectId = projectId;
  }
  /**Add a client into a project using their clientId.
   * @param {*} clientId the cliend id.
   */
  addClient(clientId) {
    return this.projects
      .getOneById(this.projectId)
      .then(({clients = []}) =>
        this.projects.updateOneById(this.projectId, {
          clients: [{clientId}, ...clients]
        })
      );
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
}

module.exports = ClientsProjects;
