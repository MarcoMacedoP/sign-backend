const passport = require("passport");
const MariaLib = require("../../../lib/mariadb");
const Boom = require("@hapi/boom");
const {BasicStrategy} = require("passport-http");

passport.use(
  new BasicStrategy(async (email, password, done) => {
    const mariadb = new MariaLib();
    const [user] = await mariadb.read(
      "users",
      `WHERE email = '${email}'`
    );
    if (!user) {
      //bad user
      return done(Boom.unauthorized(), false);
    } else {
      // if (!await bcrypt.compare(password, user.password)) {
      //   //bad password
      //   return done(new Error("Not authorized"), false);
      // }
      //everythig ok
      return done(null, user);
    }
  })
);
