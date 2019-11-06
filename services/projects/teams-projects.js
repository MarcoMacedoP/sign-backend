const ProjectServices = require("./projects");
const TeamsServices = require("../teams/teams");
const Boom = require("@hapi/boom");
const validate = require("../../utils/validations");
// const debug = require("debug")("app:services:teams-projects");
class TeamsProjects {
  constructor(projectId) {
    this.projects = new ProjectServices();
    this.teams = new TeamsServices();
    this.projectId = projectId;
  }
  getProjectTeams() {
    return this.projects.getOneById(this.projectId).then(project => {
      const {teams = []} = project;
      return this.teams
        .getMany(teams)
        .then(teamsWithFullInfo => {
          return {...project, teams: teamsWithFullInfo};
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
        if (validate.errorIs404(error)) {
          return this.projects
            .getOneById(this.projectId)
            .then(({teams = []}) =>
              this.projects.updateOneById(this.projectId, {
                teams: [{clientId}, ...teams]
              })
            );
        }
      });
  }

  /**Add a client into a project using their clientId.
   * @param {*} clientId the cliend id.
   */
  removeClient(clientId) {
    return this.projects
      .getOneById(this.projectId)
      .then(({teams}) => {
        const filteredTeams = teams.filter(
          client => client.clientId !== clientId
        );
        return this.projects.updateOneById(this.projectId, {
          teams: filteredTeams
        });
      });
  }
  findClientInProject(clientId) {
    return this.projects
      .getOneById(this.projectId)
      .then(({teams}) => {
        const [findedClientById] = teams.filter(
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

module.exports = TeamsProjects;
