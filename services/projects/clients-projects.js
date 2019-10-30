const ProjectServices = require("./projects");

class ClientsProjects {
  constructor(projectId) {
    this.projects = new ProjectServices();
    this.projectId = projectId;
  }
  /**Add a client into a project using their clientId.
   * @param {*} clientId
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
}
module.exports = ClientsProjects;
