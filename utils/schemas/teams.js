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
  providers: Joi.array()
};
module.exports = {createTeamSchema};
