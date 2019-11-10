const MongoLib = require("../../lib/mongodb");
const {ObjectId} = require("mongodb");

const reminders = () => new MongoLib("reminders");

const insertOne = reminderData => reminders().createOne(reminderData);

const updateOne = (filter, newData) =>
  reminders().updateOne(filter, newData);

const removeOne = filter => reminders().removeOne(filter);

const find = filter => reminders().readAll(filter);

const findInArray = arrayOfReminders =>
  find({
    _id: {$in: arrayOfReminders.map(id => new ObjectId(id))}
  });

module.exports = {
  find,
  insertOne,
  updateOne,
  removeOne,
  findInArray
};
