const MariaLib = require("../lib/mariadb");
const debug = require("debug")("app:services:providers");
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
  async update({ providerId, data }) {
    const { name, lastname, email, phone, imageUrl, about } = data;

    const setNewData = `name="${name}", lastname="${lastname}", email="${email}", phone=${phone}, image_url="${imageUrl}", about="${about}"`;
    const condition = `provider_id = ${providerId}`;

    const result = await this.mariadb.update(
      this.table,
      setNewData,
      condition
    );
    debug(result);
    if (result.affectedRows != 0) {
      return { status: true, updatedId: providerId };
    } else {
      throw new Error("No se actualizo el provedor. 🤷‍♀️");
    }
  }

  async remove({ providerId }) {
    const setNewData = `active = 0`;
    const condition = `provider_id = ${providerId}`;

    const result = await this.mariadb.update(
      this.table,
      setNewData,
      condition
    );
    if (result.affectedRows != 0) {
      return { status: true, removedId: providerId };
    } else {
      throw new Error("No se actualizo el provedor. 🤷‍♀️");
    }
  }
}
module.exports = ProvidersServices;
