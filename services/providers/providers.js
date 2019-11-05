const MariaLib = require("../../lib/mariadb");
//services
const ExpensesServices = require("./expenses");
class ProvidersServices {
  constructor() {
    this.table = "providers";
    this.mariadb = new MariaLib();
    this.expenses = new ExpensesServices();
  }
  getAll({userId}) {
    return this.mariadb
      .read(this.table, `WHERE user_id = ${userId} AND active=1`)
      .then(providers =>
        Promise.all(
          providers.map(provider =>
            this.expenses
              .getAll(provider.provider_id)
              .then(expenses => ({...provider, expenses}))
          )
        )
      );
  }
  getMany(providerIds) {
    const whereCondition = `WHERE provider_id ${this.mariadb.createMultipleCondition(
      providerIds
    )}`;
    return this.mariadb.read(this.table, whereCondition);
  }
  getOne(providerId) {
    const query = `WHERE provider_id = ${providerId}`; // WHERE query;
    return this.mariadb.read(this.table, query);
  }
  create(provider, userId) {
    return this.mariadb
      .create(
        this.table,
        "(name, lastname, email, phone, about, user_id)",
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

  updatePictureUrl(pictureUrl, providerId) {
    return this.mariadb.update(
      this.table,
      `image_url = ${pictureUrl}`,
      `provider_id = ${providerId}`
    );
  }

  remove({providerId}) {
    const setNewData = `active = 0`;
    const condition = `provider_id = ${providerId}`;
    return this.mariadb.update(this.table, setNewData, condition);
  }
}
module.exports = ProvidersServices;
