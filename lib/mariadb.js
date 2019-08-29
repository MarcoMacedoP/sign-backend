/*
Author: Marco Macedo
Description: This is the libray for manage Mariadb connections. 
              see docs here: https://github.com/MariaDB/mariadb-connector-nodejs/blob/master/documentation/promise-api.md

Methods: 
    CreatePlaceHolder() : This method creates and returns
              the placeholder using the length of the 'values' array. 
              In Mariadb Connector queries permit the use of question marks as placeholders
                   db.query("INSERT INTO someTable VALUES (?, ?, ?)", [value1, value2, value3]);
            This will remplace the question marks with the value of the array.

              */

const mariadb = require("mariadb");
const {dbHost,dbName,dbPassword,dbUser,dbPort} = require("../config/"); // prettier-ignore

class MariaLib {
  constructor() {
    this.dbName = dbName;
  }
  createPlaceHolder(values) {
    let placeholder = new String();
    //First we add each question mark
    values.forEach(() => {
      placeholder += "?,";
    });
    //After we romove the last ',';
    const finalPlaceholder = placeholder.slice(0, placeholder.length - 1); // prettier-ignore
    //Finally we add a parenthesis covering the placeholder and return it
    return `(${finalPlaceholder})`; //return '(?,?,?)'
  }
  connection() {
    //Make connection with database
    return mariadb.createConnection({
      host     : dbHost,
      user     : dbUser,
      password : dbPassword,
      database : dbName,
      port     : dbPort
    });
  }

  //make a custom query
  query(query = "") {
    return this.connection().then((db) => db.query(query));
  }
  /*----------CRUD OPERATIONS-----*/
  read(table, query = "", rows = "*") {
    return this.connection().then((db) =>
      db.query(`SELECT ${rows} FROM ${table} ${query}`)
    );
  }
  update(table, set, where) {
    return this.connection().then((db) =>
      db.query(`UPDATE ${table} SET ${set} WHERE ${where}`)
    );
  }
  create(table, rows, values = []) {
    //Create with a placeholder
    return this.connection().then((db) =>
      db.query(
        `INSERT INTO ${table} ${rows} 
            VALUES ${this.createPlaceHolder(values)}`, // prettier-ignore
        values //the values
      )
    );
  }
  delete(table, where) {
    return this.connection().then((db) =>
      db.query(`DELETE FROM ${table} WHERE ${where}`)
    );
  }
}
module.exports = MariaLib;
