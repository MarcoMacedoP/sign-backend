const Boom = require("@hapi/boom");

const errorIs404 = error => {
  if (Boom.isBoom(error) && error.output.statusCode === 404) {
    return true;
  } else throw error;
};
module.exports = {
  errorIs404
};
