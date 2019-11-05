const ProjectServices = require("./projects");
const ProviderServices = require("../providers/providers");

const Boom = require("@hapi/boom");

class ProvidersProjectsServices {
  constructor(projectId) {
    this.projects = new ProjectServices();
    this.clients = new ProviderServices();
    this.projectId = projectId;
  }
  addProvider(providerId) {
    return this.projects
      .getOneById(this.projectId)
      .then(({providers = []}) => {
        if (!this.providerIsInProject(providerId, providers)) {
          return this.projects.updateOneById(this.projectId, {
            providers: [{providerId}, ...providers]
          });
        } else
          throw Boom.badRequest("Provider is already in project!");
      });
  }
  removeProvider(providerId) {
    return this.projects
      .getOneById(this.projectId)
      .then(({providers}) => {
        if (this.providerIsInProject(providerId, providers)) {
          const filteredProviders = providers.filter(
            provider => provider.providerId !== providerId
          );
          return this.projects.updateOneById(this.projectId, {
            providers: filteredProviders
          });
        } else throw Boom.badRequest("Provider isn't in project!");
      });
  }
  providerIsInProject(providerId, providerList = []) {
    const [provider] = providerList.filter(
      provider => provider.providerId === providerId
    );
    return provider ? provider : null;
  }
}
module.exports = ProvidersProjectsServices;
