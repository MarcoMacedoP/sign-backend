/*
    @Author: Marco Macedo
    @Description: This fuction extract the JSON WEB TOKEN from the request
                    This will NOT validate the Token, just extract the information of it.
                    VALIDATE THE TOKEN BEFORE USING THIS FUNCTION
*/
const jwt = require("jsonwebtoken");

function extractJwt(req) {
  const {authorization} = req.headers;
  //Check if header is Bearer token
  if (authorization.startsWith("Bearer ")) {
    const token = authorization.substring(7, authorization.length); //Remove the "Bearer " from string.
    return jwt.decode(token); //Decode the token and return it.
  } else {
    throw new Error("Bad header");
  }
}
function getUserIDFromAccessToken(req) {
  const decodedJWT = extractJwt(req);
  return decodedJWT.sub;
}
module.exports = {extractJwt, getUserIDFromAccessToken};
