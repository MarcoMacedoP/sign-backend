//libs
const MongoLib = require("../lib/mongodb");
const randtoken = require("rand-token");
const Boom = require("@hapi/boom");
const debug = require("debug")("app:services:refreshToken");
//services
const UserServices = require("../services/users");
//utils
const signToken = require("../utils/auth/signToken");

class RefreshToken {
  constructor() {
    debug("nueva instancia de refresh token!");
  }
  collection() {
    return new MongoLib("tokens");
  }
  create(userId, email) {
    const refreshToken = {
      token: randtoken.uid(256),
      date: new Date(),
      userId,
      email
    };
    return this.checkIfUserHasToken(userId).then(userHasToken => {
      debug(userHasToken);
      if (userHasToken) {
        debug("updateOne");
        return this.collection()
          .updateOne({ userId }, refreshToken)
          .then(({ token }) => token);
      } else {
        debug("createOne");
        return this.collection()
          .createOne(refreshToken)
          .then(({ token }) => token);
      }
    });
  }

  /** gets a refresh token and returns a new access token
   * Search for the token on database an if exists returns
   * a new access token
   * @param {*} token the old refresh token
   */
  getAccessTokenFromRefreshToken(token) {
    return this.collection()
      .readOne({ token }) // prettier-ignore
      .then(refreshToken => {
        debug(token);
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
   * @return {Promise} that returns true if token is deleted successfully
   * @throw error if token is not on list or if an error
   *         ocurred while deleting refreshToken
   */
  removeRefreshToken(refreshToken) {
    return this.collection()
      .removeOne({ token: refreshToken })
      .then(({ deletedCount }) => {
        if (deletedCount === 0) {
          throw Boom.notFound();
        }
        return true;
      });
  }
  /** Search for userId on refreshToken list and if
   *
   */
  checkIfUserHasToken(userId) {
    debug("checkIfUserHasToken()");
    return this.collection()
      .readOne({ userId })
      .then(refreshToken => {
        debug(refreshToken);
        return refreshToken ? true : false;
      });
  }
  //gets a user from a refresh token if user exist
  getUserFromRefreshToken(refreshToken) {
    const userServices = new UserServices();
    return this.collection()
      .readOne({ token: refreshToken })
      .then(({ userId }) => userId && userServices.getByID({ userId }));
  }
}
module.exports = RefreshToken;
