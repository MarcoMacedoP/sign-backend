const Joi = require("@hapi/joi");
const {mongoIdSchema} = require("../global");
const usersRoles = {
  admin: "admin",
  member: "member",
  founder: "founder"
};
const teamsSchema = {
  name: Joi.string().required(),
  description: Joi.string(),
  picture: Joi.string(),
  members: Joi.array(),
  projects: Joi.array(),
  providers: Joi.array(),
  clients: Joi.array(),
  reminders: Joi.array()
};
const memberSchema = {
  role: Joi.string()
    .valid([usersRoles.admin, usersRoles.member, usersRoles.founder])
    .required(),
  userId: mongoIdSchema.required()
};

module.exports = {
  teamsSchema,
  memberSchema
};
