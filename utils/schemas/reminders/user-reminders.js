const Joi = require("@hapi/joi").extend(require("@hapi/joi-date"));
const {mariadbIdSchema, mongoIdSchema} = require("../global");
const reminderTitleSchema = Joi.string()
  .min(4)
  .max(50);
const reminderDescriptionSchema = Joi.string().max(254);
const reminderDateSchema = Joi.date().format("YYYY-MM-DD");

const reminderSchema = {
  title: reminderTitleSchema.required(),
  description: reminderDescriptionSchema,
  date: reminderDateSchema.required()
};
const createReminderSchema = {
  ...reminderSchema,
  userId: mariadbIdSchema.required()
};

const reminderIdSchema = {reminderId: mongoIdSchema.required()};

module.exports = {
  createReminderSchema,
  reminderIdSchema,
  reminderSchema
};
