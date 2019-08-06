const MariaLib = require("../lib/mariadb");

class ProvidersServices {
  constructor() {
    this.table = "providers";
    this.mariadb = new MariaLib();
  }
  async getAll() {
    const providers = await this.mariadb.getAll(this.table);
    return providers;
  }
}
module.exports = ProvidersServices;
