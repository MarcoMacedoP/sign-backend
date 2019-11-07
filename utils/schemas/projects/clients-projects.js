const {mongoIdSchema} = require("../global");

const clientProjectsSchema = {
  projectId: mongoIdSchema.required(),
  clientId: mongoIdSchema.required()
};

module.exports = {clientProjectsSchema};
