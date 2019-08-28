const MariaLib = require("../../lib/mariadb");
const debug = require("debug")("app:services:services");

/*
    @author: Marco Macedo
    @description: This class can make CRUD operations 
                  with products and services.
                  Defualt values make the operations
                  with the services.

*/

class ProvidersServicesServices {
  constructor({ isProduct = false }) {
    if (isProduct) {
      this.table = "products";
    }
    else {
      this.table = "services";
    }
    this.isProduct = isProduct;
    this.mariadb = new MariaLib();
  }
  async getAll({ providerId }) {
    const services = await this.mariadb.read(
      this.table,
      `WHERE provider_id = ${providerId}`
    );
    return services;
  }
  async getOne({ serviceId, productId = false }) {
    let query;
    if (productId) {
      query = `WHERE product_id = ${productId}`;
    }
    else {
      query = `WHERE service_id = ${serviceId}`;
    }
    const data = await this.mariadb.read(this.table, query);
    return data;
  }

  async create({
    providerId,
    name,
    description,
    cost,
    costPerHour,
    isProduct = false
  }) {
    let rows = "";
    let values = "";

    if (isProduct) {
      rows = "(name, description, cost, provider_id)";
      values = [ name, description, cost, providerId ];
    }
    else {
      rows = "(name, description, cost, provider_id, cost_per_hour)";
      values = [ name, description, cost, providerId, costPerHour ];
      if (costPerHour) {
        costPerHour = 1;
      }
      else {
        costPerHour = 0;
      }
    }
    const { insertId } = await this.mariadb.create(this.table, rows, values);
    return { insertId };
  }

  async update({ serviceId, data, productId }) {
    const { name, description, cost, costPerHour } = data;
    //Is update a service use this values
    let setNewData, condition;

    if (this.isProduct) {
      setNewData = `name="${name}", description="${description}", cost="${cost}"`;
      condition = `product_id = ${productId}`;
    }
    else {
      setNewData = `name="${name}", description="${description}", cost_per_hour="${costPerHour}", cost="${cost}"`;
      condition = `service_id = ${serviceId}`;
    }

    const result = await this.mariadb.update(this.table, setNewData, condition);
    if (result.affectedRows != 0) {
      return { status: true, updatedId: serviceId || productId };
    }
    else {
      if (this.isProduct) {
        throw new Error("No se actualizo el producto. 🤷‍♀️");
      }
      else {
        throw new Error("No se actualizo el servicio. 🤷‍♀️");
      }
    }
  }

  async remove({ serviceId, productId = null }) {
    const setNewData = `active = 0`;
    let condition;
    if (this.isProduct) {
      condition = `product_id = ${productId}`;
    }
    else {
      condition = `service_id = ${serviceId}`;
    }
    const result = await this.mariadb.update(this.table, setNewData, condition);
    if (result.affectedRows != 0) {
      if (this.isProduct) {
        return { status: true, removedId: productId };
      }
      else {
        return { status: true, removedId: serviceId };
      }
    }
    else {
      if (this.isProduct) {
        throw new Error("No se actualizo el producto. 🤷‍♀️");
      }
      else {
        throw new Error("No se actualizo el servicio. 🤷‍♀️");
      }
    }
  }
}
module.exports = ProvidersServicesServices;
