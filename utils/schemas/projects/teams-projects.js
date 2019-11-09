const {mongoIdSchema} = require("../global");

const addTeamToProjectSchema = {
  projectId: mongoIdSchema.required(),
  teamId: mongoIdSchema.required()
};
const removeTeamInProjectSchema = addTeamToProjectSchema;

module.exports = {
  addTeamToProjectSchema,
  removeTeamInProjectSchema
};
