/*
-------------------------------
@author: Marco Macedo
@Description: This is the midleware for validate request. 
            - Validation handler is a closure that returns a middleware
            that invokes the function validate, and then, 
            if error exits call the errors middlewares, if not call next middleware.
                :)
-------------------------------
*/
const Joi = require("@hapi/joi");
const boom = require("@hapi/boom");

function validate(data, schema) {
  const { error } = Joi.validate(data, schema);
  return error;
}
function validationHandler(schema, check = "body") {
  return (req, res, next) => {
    const error = validate(req[check], schema);
    error ? next(boom.badRequest(error)) : next();
    // if error call error middleware, if not call next middleware
  };
}
module.exports = validationHandler;
