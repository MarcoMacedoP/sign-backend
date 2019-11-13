const RemindersServices = require("./reminders");
const { ObjectId } = require("mongodb");
class UserRemindersServices {
  collection() {
    return new RemindersServices();
  }
  findAll(userId) {
    return this.collection().find({ userId: userId.toString() });
  }

  //utils
  makeUserFilter(userId, remidnerId) {
    return {
      userId: userId.toString(),
      _id: new ObjectId(remidnerId)
    };
  }
  //basic crud operations
  findOne(userId, reminderId) {
    return this.collection().find(this.makeUserFilter(userId, reminderId));
  }

  insertOne(userId, reminderData) {
    return this.collection().insertOne({
      userId,
      ...reminderData
    });
  }

  updateOne(userId, reminderId, newData) {
    return this.collection().updateOne(
      this.makeUserFilter(userId, reminderId),
      newData
    );
  }

  removeOne(userId, reminderId) {
    return this.collection()
      .removeOne(this.makeUserFilter(userId, reminderId))
      .then(result => ({
        reminderId: reminderId,
        deletedReminders: result.deletedCount
      }));
  }
}
module.exports = UserRemindersServices;
