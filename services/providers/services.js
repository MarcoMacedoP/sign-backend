const MariaLib = require("../../lib/mariadb");

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
    const query = `service_id = ${serviceId}`; // WHERE query;
    const service = await this.mariadb.getOne(this.table, query);
    return service;
  }

  async create({ userId, name, description, cost, costPerHour }) {
    const result = await this.mariadb.create(this.table);
  }

  async update({ serviceId, data }) {
    const { name, description, cost, costPerHour } = data;

    const setNewData = `name="${name}", description="${description}", cost_per_hour="${costPerHour}", cost="${cost}"`;
    const condition = `service_id = ${serviceId}`;

    const result = await this.mariadb.update(
      this.table,
      setNewData,
      condition
    );
    if (result.affectedRows != 0) {
      return { status: true, updatedId: providerId };
    } else {
      throw new Error("No se actualizo el servicio. 🤷‍♀️");
    }
  }

  async remove({ serviceId }) {
    const setNewData = `active = 0`;
    const condition = `service_id = ${serviceId}`;

    const result = await this.mariadb.update(
      this.table,
      setNewData,
      condition
    );
    if (result.affectedRows != 0) {
      return { status: true, removedId: serviceId };
    } else {
      throw new Error("No se pudo eliminar el servicio. 🤷‍♀️");
    }
  }
}
module.exports = ProvidersServicesServices;
