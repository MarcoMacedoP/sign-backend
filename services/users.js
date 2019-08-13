const MariaLib = require("../lib/mariadb");

class UsersServices {
  constructor() {
    this.table = "users";
    this.mariadb = new MariaLib();
  }
  async signUp({ name, lastname, password, email }) {
    //insertOne method decapreteded

    const rows = "(name, lastname, password, email)";
    const values = [ name, lastname, password, email ];
    const result = await this.mariadb.insertOne(
      this.table,
      rows,
      values
    );
    return result;
  }
  async getByID({ userId }) {
    //Get one method decapreteded
    const user = await this.mariadb.getOne(
      this.table,
      `user_id = ${userId}`
    );
    return user;
  }
  async getByEmail({ email }) {
    const [ user ] = await this.mariadb.read(
      "users",
      `email = '${email}'
      `
    );
    return user;
  }
}
module.exports = UsersServices;
