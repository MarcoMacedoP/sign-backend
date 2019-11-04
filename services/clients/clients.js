const MariaLib = require("../../lib/mariadb");

class ClientsServices extends MariaLib {
  constructor() {
    super();
    this.table = "clients";
  }
  getMany(clientsIds = []) {
    const whereCondition = `WHERE client_id ${this.createMultipleCondition(
      clientsIds
    )}`;
    return this.read(this.table, whereCondition);
  }
  getAll(userId) {
    return this.read(
      this.table,
      `WHERE user_id =${userId} AND active=1`
    );
  }
  getOne(clientId) {
    return this.read(
      this.table,
      `WHERE client_id = ${clientId}`
    ).then(clients => clients[0]);
  }
  createOne({userId, name, lastname, email, phone}) {
    let rows = "(name, lastname, email, phone, user_id)";
    let values = [name, lastname, email, phone, userId];

    //Data validation
    if (!email || !phone) {
      rows = `(name, lastname ${email ? ", email" : ""} ${phone ? ", phone" : ""}, user_id )`; // prettier-ignore
      if (!phone) values = [name, lastname, email, userId];
      if (!email) values = [name, lastname, phone, userId];
    }
    return this.create(this.table, rows, values).then(({insertId}) =>
      this.getOne(insertId)
    );
  }
  remove({clientId}) {
    const setValues = "active = 0";
    const condition = `client_id = ${clientId}`;
    return this.update(this.table, setValues, condition);
  }
  updateOne({clientId, name, lastname, email, phone}) {
    const setValues = `name = '${name}', lastname = '${lastname}', email = '${email}', phone = ${phone}`;
    const condition = `client_id = ${clientId}`;
    return this.update(this.table, setValues, condition).then(() =>
      this.getOne(clientId)
    );
  }
}
module.exports = ClientsServices;
