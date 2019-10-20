const ProvidersServices = require("./providers");
const Boom = require("@hapi/boom");

class UserProvidersServices {
  constructor() {
    this.providersServices = new ProvidersServices();
  }
  async updatePictureUrl(userId, providerId, pictureUrl) {
    const provider = this.providersServices.getOne(providerId);
    if (!provider) {
      throw Boom.notFound("Provider not found!");
    }
    return this.providersServices.updatePictureUrl(
      pictureUrl,
      providerId
    );
  }
}
module.exports = UserProvidersServices;
