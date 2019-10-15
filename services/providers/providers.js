const MariaLib = require("../../lib/mariadb");
class ProvidersServices {
  constructor() {
    this.table = "providers";
    this.mariadb = new MariaLib();
  }
  getAll({userId}) {
    return this.mariadb.read(
      this.table,
      `WHERE user_id = ${userId} AND active=1`
    );
  }
  getOne(providerId) {
    const query = `WHERE provider_id = ${providerId}`; // WHERE query;
    return this.mariadb.read(this.table, query);
  }
  create(provider, userId) {
    return this.mariadb
      .create(
        this.table,
        "(name, lastname, email, phone, image_url, about, user_id)",
        [...provider, userId]
      )
      .then(({insertId}) => this.getOne(insertId));
  }
  update(providerId, data) {
    const {name, lastname, email, phone, imageUrl, about} = data;
    const setNewData = `name="${name}", lastname="${lastname}", email="${email}", phone=${phone}, image_url="${imageUrl}", about="${about}"`;
    const condition = `provider_id = ${providerId}`;
    return this.mariadb
      .update(this.table, setNewData, condition)
      .then(() => this.getOne(providerId));
  }

  remove({providerId}) {
    const setNewData = `active = 0`;
    const condition = `provider_id = ${providerId}`;
    return this.mariadb.update(this.table, setNewData, condition);
  }
}
module.exports = ProvidersServices;
