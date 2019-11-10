//libs
const router = require("./teams-user");
const debug = require("debug")("app:teams:api");
//services
const TeamsServices = require("../../services/teams/teams");

//middlewares
const fileUpload = require("../../utils/middlewares/fileUpload");
//utils
const {sendGoodResponse} = require("../../utils/responses");
const config = require("../../config/");

router.patch(
  "/photo/:teamId",
  fileUpload.single("picture"),
  async (request, response, next) => {
    debug(request.headers);
    if (!request.file) {
      next("No picture!");
    } else {
      const pictureUrl = `${config.serverUrl}/static/uploads/${request.file.filename}`;
      const teamId = request.params.teamId;
      const teamsServices = new TeamsServices();
      try {
        const updatedTeam = await teamsServices.updateOne(teamId, {
          picture: pictureUrl
        });
        sendGoodResponse({
          response,
          message: "updated photo team",
          statusCode: 201,
          data: updatedTeam
        });
      } catch (error) {
        next(error);
      }
    }
  }
);
module.exports = router;
