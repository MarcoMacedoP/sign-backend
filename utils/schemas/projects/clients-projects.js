const {mongoIdSchema, mariadbIdSchema} = require("../global");

const clientProjectsSchema = {
  projectId: mongoIdSchema.required(),
  clientId: mariadbIdSchema.required()
};

module.exports = {clientProjectsSchema};
