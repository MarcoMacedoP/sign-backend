const jwt = require("jsonwebtoken");
const config = require("../../config");

function signToken({sub, email}) {
  const payload = {
    sub,
    email
  };
  return jwt.sign(payload, config.authJwtSecret, {
    expiresIn: "15m"
  });
}
module.exports = signToken;
