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
const debug = require("debug")("app:lib:mariadb");
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
  /**
   * Creates a where condition of multiple values.
   * @param {Array} array
   * @param {String} operator
   */
  createMultipleCondition(array = []) {
    if (array.length === 0) {
      throw new Error("Array is too short");
    }
    debug(array);
    let initialQuery = "";
    array.forEach(element => {
      //add the element and the operator to the string,
      if (element) {
        initialQuery += `${element},`;
      }
    });
    debug("initialQuery", initialQuery);

    //remove last operator
    const finalQuery = `IN(${initialQuery.slice(0, initialQuery.length - 1)})` // prettier-ignore
    debug(finalQuery);
    return finalQuery;
  }

  connection() {
    //Make connection with database
    return mariadb.createConnection({
      host: dbHost,
      user: dbUser,
      password: dbPassword,
      database: dbName,
      port: dbPort
    });
  }

  //make a custom query
  async query(query = "") {
    const db = await this.connection();
    return db.query(query).then(async result => {
      await db.end().then(() => debug("closed conn"));
      return result;
    });
  }
  /*----------CRUD OPERATIONS-----*/
  async read(table, query = "", rows = "*") {
    const db = await this.connection();
    return db
      .query(`SELECT ${rows} FROM ${table} ${query}`)
      .then(async result => {
        await db.end().then(() => debug("closed conn"));
        return result;
      });
  }
  /**Update a value from an sql table.
   *
   * @param {*} table the table that you want to update
   * @param {*} set the values that you want to update.
   *            example: `column1 = ${value}, column2 = ${value2}`
   * @param {*} where the condition to be aplied, example `id = ${value}`
   * @returns a promise with the maked query to be resolved.
   *     db.query(`UPDATE ${table} SET ${set} WHERE ${where}`)
   */
  async update(table, set, where) {
    const db = await this.connection();

    return db
      .query(`UPDATE ${table} SET ${set} WHERE ${where}`)
      .then(async result => {
        await db.end().then(() => debug("closed conn"));
        return result;
      });
  }
  //Create with a placeholder
  async create(table, rows, values = []) {
    const db = await this.connection();

    return db
      .query(
        `INSERT INTO ${table} ${rows} 
            VALUES ${this.createPlaceHolder(values)}`, // prettier-ignore
        values //the values
      )
      .then(async result => {
        await db.end().then(() => debug("closed conn"));
        return result;
      });
  }
  async delete(table, where) {
    const db = await this.connection();
    return db
      .query(`DELETE FROM ${table} WHERE ${where}`)
      .then(async result => {
        await db.end().then(() => debug("closed conn"));
        return result;
      });
  }
}
module.exports = MariaLib;
