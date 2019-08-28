/*
@Author: Marco Macedo
@Description: Strategy for use jws for autenticate routes

*/

const passport = require("passport");
const { Strategy, ExtractJwt } = require("passport-jwt");
const MariaLib = require("../../../lib/mariadb");
const config = require("../../../config/");
const boom = require("@hapi/boom");

passport.use(
  new Strategy(
    {
      secretOrKey    : config.authJwtSecret,
      jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken()
    },
    async function(tokenPayload, done) {
      const mariadb = new MariaLib();

      try {
        const [ user ] = await mariadb.read(
          "users",
          `WHERE user_id=${tokenPayload.sub}`
        );

        if (!user) {
          boom.unauthorized();
        }

        return done(null, user);
      } catch (error) {
        done(boom.unauthorized());
      }
    }
  )
);
