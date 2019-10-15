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
    const collection = "tokens";
    this.mongodb = new MongoLib(collection);
  }
  create(userId, email) {
    const refreshToken = {
      token: randtoken.uid(256),
      date: new Date(),
      userId,
      email
    };
    return this.checkIfUserHasToken(userId).then(userHasToken =>
      userHasToken
        ? this.mongodb
            .updateOne({userId}, refreshToken)
            .then(({token}) => token)
        : this.mongodb
            .createOne(refreshToken)
            .then(({token}) => token)
    );
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
    return this.mongodb
      .removeOne({token: refreshToken})
      .then(({deletedCount}) => {
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
    return this.mongodb.readOne({userId}).then(refreshToken => {
      debug(refreshToken);
      return refreshToken ? true : false;
    });
  }
  //gets a user from a refresh token if user exist
  getUserFromRefreshToken(refreshToken) {
    const userServices = new UserServices();
    return this.mongodb
      .readOne({token: refreshToken})
      .then(({userId}) => userId && userServices.getByID({userId}));
  }
}
module.exports = RefreshToken;
