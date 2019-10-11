//libs
const MongoLib = require("../lib/mongodb");
const randtoken = require("rand-token");
const Boom = require("@hapi/boom");
const debug = require("debug")("app:services:refreshToken");
//services
const signToken = require("../utils/auth/signToken");

class RefreshToken {
  constructor() {
    this.collection = "tokens";
    this.mongo = new MongoLib();
  }
  create(userId, email) {
    const token = randtoken.uid(256);
    const date = new Date();
    return this.mongo
      .createOne(this.collection, {
        userId,
        token,
        date,
        email
      })
      .then(({token}) => token);
  }
  /** gets a refresh token and returns a new access token
   * Search for the token on database an if exists returns
   * a new access token
   * @param {*} token the old refresh token
   */
  async getAccessTokenFromRefreshToken(token) {
    return this.mongo
      .readOne(this.collection, {token}) // prettier-ignore
      .then(refreshToken => {
        if (!refreshToken) {
          throw Boom.unauthorized();
        }
        return signToken({
          sub: refreshToken.userId,
          email: refreshToken.email
        });
      });
  }
}
module.exports = RefreshToken;
