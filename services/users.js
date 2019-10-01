const MariaLib = require("../lib/mariadb");
const bcrypt = require("bcrypt");
const debug = require("debug")("app:services:users");

class UsersServices {
  constructor() {
    this.table = "users";
    this.mariadb = new MariaLib();
  }
  /**Register user and after that check if is created
   * @param {*} name the name of the user
   * @param {*} lastname the lastname of the user
   * @param {*} password the passoword of the user
   * @param {*} email the email of the user
   */
  async signUp({name, lastname, password, email}) {
    //encrypt password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    //return promise that after create the user return it
    return this.mariadb
      .create(this.table, "(email, name, lastname, password)", [
        email,
        name,
        lastname,
        hashedPassword
      ])
      .then(({insertId}) =>
        this.mariadb.read(
          this.table,
          `WHERE user_id = '${insertId}'`,
          "email, password"
        )
      );
  }
  async getByID({userId}) {
    //Get one method decapreteded
    const user = await this.mariadb.getOne(
      this.table,
      `user_id = ${userId}`
    );
    return user;
  }
  async getByEmail({email}) {
    const [user] = await this.mariadb.read(
      "users",
      `WHERE email = '${email}'
      `
    );
    return user;
  }
}
module.exports = UsersServices;
