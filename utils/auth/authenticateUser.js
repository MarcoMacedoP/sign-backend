const passport = require("passport");
const signToken = require("./signToken");

require("./strategies/basic");

function authenticateUser(req, res, next) {
  debug(req.headers);
  passport.authenticate("basic", function(error, user) {
    debug(user);
    try {
      if (error) {
        next(error);
      }
      if (!user) {
        next(Boom.unauthorized());
      } else {
        req.logIn(user, {session: false}, async error => {
          if (error) {
            next(Boom.unauthorized());
          } else {
            debug("GOOOOD RESPONSE");
            const accessToken = signToken({
              sub: user.user_id,
              email: user.email
            });
            const refreshToken = await new RefreshToken().create(
              user.user_id,
              user.email
            );

            sendGoodResponse({
              response: res,
              message: "good auth",
              data: {
                token: {
                  accessToken,
                  refreshToken
                },
                user: {
                  id: user.user_id,
                  name: user.name,
                  lastname: user.lastname,
                  profilePic: user.profile_pic_url,
                  bio: user.biography,
                  job: user.job_title
                }
              }
            });
          }
        });
      }
    } catch (error) {
      next(Boom.unauthorized());
    }
  })(req, res, next);
}
module.exports = authenticateUser;
