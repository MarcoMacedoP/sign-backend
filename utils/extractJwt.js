/*
    @Author: Marco Macedo
    @Description: This fuction extract the JSON WEB TOKEN from the request
                    This will NOT validate the Token, just extract the information of it.
                    VALIDATE THE TOKEN BEFORE USING THIS FUNCTION
*/
const jwt = require("jsonwebtoken");

function extractJwt(req) {
  const { authorization } = req.headers;
  //Check if header is Bearer token
  if (authorization.startsWith("Bearer ")) {
    //Remove the "Bearer " from string.
    const token = authorization.substring(7, authorization.length);
    return jwt.decode(token); //Decode the token and return it.
  } else {
    throw new Error("Bad header");
  }
}

module.exports = { extractJwt };