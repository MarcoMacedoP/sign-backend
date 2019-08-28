const boom = require("@hapi/boom");
const config = require("../../config");
const debug = require("debug")("app:error");

function withErrorStack(err, stack) {
  if (config.dev) {
    return { ...err, stack };
  }
}

function logErrors(err, req, res, next) {
  debug(err);
  next(err);
}

function wrapErrors(err, req, res, next) {
  if (!err.isBoom) {
    next(boom.badImplementation(err));
  }

  next(err);
}

function clientErrorHandler(err, req, res, next) {
  const { output: { statusCode, payload } } = err;

  // catch if an error ocurrs while streaming

  if (res.headersSent) {
    res.status(statusCode).json(withErrorStack(payload, err.stack));
  }
  else {
    next(err);
  }
}

function errorHandler(err, req, res, next) {
  const { output: { statusCode, payload } } = err;

  res.status(statusCode).json(withErrorStack(payload, err.stack));
}

module.exports = {
  logErrors,
  wrapErrors,
  clientErrorHandler,
  errorHandler
};
