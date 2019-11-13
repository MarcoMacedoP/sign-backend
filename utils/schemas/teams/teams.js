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
  projects: Joi.array(),
  providers: Joi.array(),
  clients: Joi.array(),
  reminders: Joi.array()
};

const teamId = mongoIdSchema.required();
const membersTeamsSchema = {
  userId: mongoIdSchema.required(),
  role: Joi.valid([
    usersRoles.admin,
    usersRoles.founder,
    usersRoles.member
  ]).required(),
  teamId
};
const getTeamShema = {
  teamId
};
module.exports = {getTeamShema, membersTeamsSchema, teamsSchema};
