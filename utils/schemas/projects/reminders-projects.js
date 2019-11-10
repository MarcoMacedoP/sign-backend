const {mongoIdSchema} = require("../global");

const addReminderToProjectSchema = {
  projectId: mongoIdSchema.required(),
  reminderId: mongoIdSchema.required()
};
const removeReminderInProjectSchema = addReminderToProjectSchema;

module.exports = {
  addReminderToProjectSchema,
  removeReminderInProjectSchema
};
