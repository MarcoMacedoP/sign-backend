const MariaLib = require("../../lib/mariadb");
const debug = require("debug")("app:services:services");
class ProvidersServicesServices {
  constructor() {
    this.table = "services";
    this.mariadb = new MariaLib();
  }
  async getAll({ providerId }) {
    const services = await this.mariadb.read(
      this.table,
      `WHERE provider_id = ${providerId}`
    );
    return services;
  }
  async getOne({ serviceId }) {
    const query = `WHERE service_id = ${serviceId}`; // WHERE query;
    const service = await this.mariadb.read(this.table, query);
    return service;
  }

  async create({ providerId, name, description, cost, costPerHour }) {
    const rows = "(name, description, cost, provider_id)";
    const values = [ name, description, cost, providerId ];
    const { insertId } = await this.mariadb.create(this.table, rows, values);
    debug(insertId);
    return { insertId };
  }

  async update({ serviceId, data }) {
    const { name, description, cost, costPerHour } = data;

    const setNewData = `name="${name}", description="${description}", cost_per_hour="${costPerHour}", cost="${cost}"`;
    const condition = `service_id = ${serviceId}`;

    const result = await this.mariadb.update(this.table, setNewData, condition);
    if (result.affectedRows != 0) {
      return { status: true, updatedServiceId: serviceId };
    }
    else {
      throw new Error("No se actualizo el servicio. 🤷‍♀️");
    }
  }

  async remove({ serviceId }) {
    const setNewData = `active = 0`;
    const condition = `service_id = ${serviceId}`;

    const result = await this.mariadb.update(this.table, setNewData, condition);
    if (result.affectedRows != 0) {
      return { status: true, removedId: serviceId };
    }
    else {
      throw new Error("No se pudo eliminar el servicio. 🤷‍♀️");
    }
  }
}
module.exports = ProvidersServicesServices;
