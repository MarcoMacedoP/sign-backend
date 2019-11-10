const boom = require("@hapi/boom");
const config = require("../../config");
const debug = require("debug")("app:error");
const {sendBadResponse} = require("../responses");

function isRequestAjaxOrApi(req) {
  return !req.accepts("html") || req.xhr;
}

function logErrors(err, req, res, next) {
  debug(err);

  next(err);
}
function withErrorStack(err, stack) {
  if (config.dev) {
    return {...err, stack};
  }
}

function wrapErrors(err, req, res, next) {
  if (!err.isBoom) {
    next(boom.badImplementation(err));
  } else {
    next(err);
  }
}
function clientErrors(err, req, res, next) {
  const {
    output: {statusCode, payload}
  } = err;
  if (isRequestAjaxOrApi(req) || req.headersSent) {
    //Catch erros from AJAX request and errors while streaming
    res.status(statusCode).json(withErrorStack(payload, err.stack));
  } else {
    next(err);
  }
}
function errorHandler(err, req, res, next) {
  const {
    output: {statusCode, payload}
  } = err;
  res.status(statusCode).json(withErrorStack(payload, err.stack));
}
module.exports = {
  logErrors,
  wrapErrors,
  clientErrors,
  errorHandler
};
