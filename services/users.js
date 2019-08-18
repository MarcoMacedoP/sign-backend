const MariaLib = require("../lib/mariadb");
const debug = require("debug")("app:services:users");

class UsersServices {
  constructor() {
    this.table = "users";
    this.mariadb = new MariaLib();
  }
  async signUp({ name, lastname, password, email }) {
    //Register user and after that check if is created
    const { insertId } = await this.mariadb.create(
      this.table,
      "(email, name, lastname, password)",
      [ email, name, lastname, password ]
    );
    debug(insertId);
    //SELECT email, password  FROM users WHERE email = ?
    if (insertId) {
      const user = await this.mariadb.read(
        this.table,
        `WHERE user_id = '${insertId}'`,
        "email, password"
      );
      debug(user);
      return user[0];
    } else {
      throw new Error("Error on services");
    }
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
      `WHERE email = '${email}'
      `
    );
    return user;
  }
}
module.exports = UsersServices;
