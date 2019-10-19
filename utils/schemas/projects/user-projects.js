const Joi = require("@hapi/joi");

const createProjectSchema = {
  name: Joi.string()
    .max(40)
    .required(),
  description: Joi.string()
    .max(200)
    .required(),
  dueDate: Joi.string(),
  activities: Joi.array(),
  incomes: Joi.array(),
  expenses: Joi.array()
};

module.exports = {createProjectSchema};
