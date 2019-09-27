const passport = require("passport");
const MariaLib = require("../../../lib/mariadb");
const Boom = require("@hapi/boom");
const {BasicStrategy} = require("passport-http");
const bcrypt = require("bcrypt");
const debug = require("debug")("app:auth:basic");

passport.use(
  new BasicStrategy(async (email, password, done) => {
    debug(password);
    const mariadb = new MariaLib();
    const [user] = await mariadb.read(
      "users",
      `WHERE email = '${email}'`
    );
    debug(user);
    debug(`email:${email} , pass:${password}`);
    if (!user) {
      //bad user
      debug("bad user");
      return done(Boom.unauthorized(), false);
    } else {
      bcrypt.compare(password, user.password, (error, samePass) => {
        if (error || !samePass) {
          //bad password
          debug("bad password");
          return done(Boom.unauthorized(), false);
        }

        //everythig ok
        return done(null, user);
      });
    }
  })
);
