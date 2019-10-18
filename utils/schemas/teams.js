const Joi = require("@hapi/joi");
const createTeamSchema = {
  name: Joi.string()
    .min(4)
    .max(40)
    .required(),
  description: Joi.string()
    .min(4)
    .max(100),
  projects: Joi.array(),
  clients: Joi.array(),
  providers: Joi.array(),
  users: Joi.array()
};
const addUserSchema = {
  id: Joi.number().required()
};
const removeUserSchema = {
  removedUser: Joi.number().required()
};
module.exports = {createTeamSchema, addUserSchema, removeUserSchema};
