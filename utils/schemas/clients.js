const Joi = require("@hapi/joi");

const clientNameSchema = Joi.string()
  .min(4)
  .max(50);
const clientEmailSchema = Joi.string().email({minDomainSegments: 2});
const clientIdSchema = Joi.number()
  .integer()
  .min(1);
const clientPhoneSchema = Joi.string()
  .alphanum()
  .min(8)
  .max(20);

const createClientSchema = {
  name: clientNameSchema.required(),
  lastname: clientNameSchema.required(),
  email: clientEmailSchema,
  phone: clientPhoneSchema,
  projects: Joi.array()
};

module.exports = {
  createClientSchema,
  clientIdSchema
};
