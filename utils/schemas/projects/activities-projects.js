const Joi = require("@hapi/joi").extend(require("@hapi/joi-date"));
const {mongoIdSchema} = require("../global");
const statusSchema = Joi.valid(
  "PENDING",
  "IN_PROGRESS",
  "DONED"
).required();
const projectIdSchema = mongoIdSchema.required();

const createActivitieSchema = {
  name: Joi.string()
    .max(30)
    .required(),
  description: Joi.string().max(200),
  status: statusSchema,
  date: Joi.date(),
  comments: Joi.array()
};
const changeStatusSchema = {
  status: statusSchema,
  projectId: projectIdSchema,
  activitieId: projectIdSchema
};

module.exports = {
  createActivitieSchema,
  changeStatusSchema,
  projectIdSchema
};
