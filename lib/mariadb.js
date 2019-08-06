const mariadb = require("mariadb/callback");
const {
  dbHost,
  dbName,
  dbPassword,
  dbUser,
  dbPort
} = require("../config/");
class MariaLib {
  constructor() {
    this.client = mariadb.createConnection({
      host     : dbHost,
      user     : dbUser,
      password : dbPassword,
      database : dbName,
      port     : dbPort
    });
    this.dbName = dbName;
  }
  connection() {
    return new Promise(async (resolve, reject) => {
      client.connect((error) => {
        if (error) {
          reject(error);
        } else {
          console.log("Connect success");
          resolve(client);
        }
      });
    });
  }
  getAll(table) {
    return this.connection().then((db) => {
      return db.query(`SELECT * FROM ${table}`);
    });
  }
}
module.exports = MariaLib;
