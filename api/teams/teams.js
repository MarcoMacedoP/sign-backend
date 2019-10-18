//libs
const router = require("express").Router();
const debug = require("debug")("app:teams:api");
//services
const TeamsServices = require("../../services/teams/teams");
//validate
const validate = require("../../utils/middlewares/validationHandler");
const {createTeamSchema} = require("../../utils/schemas/teams");
//middlewares
const fileUpload = require("../../utils/middlewares/fileUpload");
//utils
const {sendGoodResponse} = require("../../utils/responses");
const {getUserIDFromAccessToken} = require("../../utils/extractJwt");
const config = require("../../config/");
router.post(
  "/",
  validate(createTeamSchema),
  async (request, response, next) => {
    const userId = getUserIDFromAccessToken(request);
    const teamsServices = new TeamsServices();
    try {
      const teams = await teamsServices.createOne({
        ...request.body,
        userId
      });
      sendGoodResponse({
        response,
        message: "create a team",
        statusCode: 200,
        data: teams
      });
    } catch (error) {
      next(error);
    }
  }
);
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
