const MariaLib = require("../lib/mariadb");

class ProvidersServices {
  constructor() {
    this.table = "providers";
    this.mariadb = new MariaLib();
  }
  async getAll({ userId }) {
    const providers = await this.mariadb.read(
      this.table,
      `WHERE user_id = ${userId}`
    );
    return providers;
  }
  async getOne({ providerId }) {
    const query = `provider_id = ${providerId}`; // WHERE query;
    const provider = await this.mariadb.getOne(this.table, query);
    return provider;
  }
}
module.exports = ProvidersServices;
