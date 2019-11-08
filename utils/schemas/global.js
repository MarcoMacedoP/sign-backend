const Joi = require("@hapi/joi");

const mongoIdSchema = Joi.string().regex(/^[0-9a-fA-F]{24,24}$/);
const mariadbIdSchema = Joi.number();

module.exports = {mongoIdSchema, mariadbIdSchema};
