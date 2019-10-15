const debug = require("debug")("app:services:services");
const MongoLib = require("../../lib/mongodb");

/*
    @author: Marco Macedo
    @description: This class can make CRUD operations 
                  with products and services.
                  Defualt values make the operations
                  with the services.

*/

class Expenses {
  constructor() {
    this.mongodb = new MongoLib("incomes");
  }
  getAll(providerId) {
    return this.mongodb.readAll(providerId);
  }
  getOneById(expenseId) {
    return this.mongodb.readById(expenseId);
  }
  createOne(income) {
    return this.mongodb.createOne(income);
  }
  updateOne(updatedIncome, expenseId) {
    return this.mongodb.updateOneById(expenseId, updatedIncome);
  }
  removeOne(expenseId) {
    return this.mongodb.removeOneById(expenseId);
  }
}
module.exports = Expenses;
