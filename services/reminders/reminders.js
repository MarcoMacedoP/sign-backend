const MongoLib = require("../../lib/mongodb");
const { ObjectId } = require("mongodb");

class RemindersServices {
  collection() {
    return new MongoLib("reminders");
  }
  insertOne(reminderData) {
    return this.collection().createOne(reminderData);
  }
  updateOne(filter, newData) {
    return this.collection().updateOne(filter, newData);
  }
  removeOne(filter) {
    return this.collection().removeOne(filter);
  }
  find(filter) {
    return this.collection().readAll(filter);
  }
  findInArray(arrayOfReminders = []) {
    return this.find({
      _id: { $in: arrayOfReminders.map(id => new ObjectId(id)) }
    });
  }
}

module.exports = RemindersServices;
