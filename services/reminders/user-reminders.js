const reminderServices = require("./index");
const {ObjectId} = require("mongodb");
const debug = require("debug")("app:services:user-reminders");
//utils
const makeUserFilter = (userId, remidnerId) => ({
  userId: userId.toString(),
  _id: new ObjectId(remidnerId)
});
//basic crud operations
const findAll = userId =>
  reminderServices.find({userId: userId.toString()});

const findOne = (userId, reminderId) =>
  reminderServices.find(makeUserFilter(userId, reminderId));

const insertOne = (userId, reminderData) =>
  reminderServices.insertOne({
    userId,
    ...reminderData
  });

const updateOne = (userId, reminderId, newData) =>
  reminderServices.updateOne(
    makeUserFilter(userId, reminderId),
    newData
  );

const removeOne = (userId, reminderId) =>
  reminderServices
    .removeOne(makeUserFilter(userId, reminderId))
    .then(result => ({
      reminderId: reminderId,
      deletedReminders: result.deletedCount
    }));

module.exports = {
  findAll,
  findOne,
  insertOne,
  updateOne,
  removeOne
};
