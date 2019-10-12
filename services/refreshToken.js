//libs
const MongoLib = require("../lib/mongodb");
const randtoken = require("rand-token");
const Boom = require("@hapi/boom");
const debug = require("debug")("app:services:refreshToken");
//services
const signToken = require("../utils/auth/signToken");

class RefreshToken {
  constructor() {
    const collection = "tokens";
    this.mongodb = new MongoLib(collection);
  }
  create(userId, email) {
    const token = randtoken.uid(256);
    const date = new Date();
    return this.mongodb
      .createOne({
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
  getAccessTokenFromRefreshToken(token) {
    return this.mongodb
      .readOne({token}) // prettier-ignore
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

  /**Remove from database the refreshToken
   * that are received on param
   *
   * @param refreshToken the token to be deleted
   * @return true if token is deleted successfully
   * @throw error if token is not on list or if an error
   *         ocurred while deleting refreshToken
   */
  removeRefreshToken(refreshToken) {
    return this.mongodb
      .removeOne({token: refreshToken})
      .then(response => {
        debug(response);
        return response;
      });
  }
}
module.exports = RefreshToken;
