const Joi = require("@hapi/joi").extend(require("@hapi/joi-date"));

const reminderTitleSchema = Joi.string().min(4).max(50);
const reminderDescriptionSchema = Joi.string().max(254);
const reminderDateSchema = Joi.date().format("YYYY-MM-DD");
const idSchema = Joi.number().integer().min(1);

const createReminderSchema = {
  title       : reminderTitleSchema.required(),
  description : reminderDescriptionSchema,
  date        : reminderDateSchema.required(),
  clientId    : idSchema,
  providerId  : idSchema
};

module.exports = {
  createReminderSchema
};
