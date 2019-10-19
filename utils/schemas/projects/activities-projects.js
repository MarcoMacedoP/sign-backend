const Joi = require("@hapi/joi");
const {mongoIdSchema} = require("../global");

const createActivitieSchema = {
  name: Joi.string()
    .max(30)
    .required(),
  description: Joi.string().max(200),
  status: Joi.valid("PENDING", "IN_PROGRESS", "DONED").required(),
  comments: Joi.array()
};
const projectIdSchema = mongoIdSchema.required();

module.exports = {createActivitieSchema, projectIdSchema};
