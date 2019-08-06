const mariadb = require("mariadb");
const {
  dbHost,
  dbName,
  dbPassword,
  dbUser,
  dbPort
} = require("../config/");
class MariaLib {
  constructor() {
    this.dbName = dbName;
  }
  connection() {
    return mariadb.createConnection({
      host     : dbHost,
      user     : dbUser,
      password : dbPassword,
      database : dbName,
      port     : dbPort
    });
  }
  getAll(table) {
    const connection = this.connection();
    return connection.then((db) =>
      db.query(`SELECT * FROM ${table}`)
    );
  }
}
module.exports = MariaLib;
