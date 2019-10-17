//libs
const router = require("express").Router();
const multer = require("multer");
//services
const TeamsServices = require("../../services/teams/teams");
//validate
const validate = require("../../utils/middlewares/validationHandler");
const {createTeamSchema} = require("../../utils/schemas/teams");
//utils
const {sendGoodResponse} = require("../../utils/responses");
const {getUserIDFromAccessToken} = require("../../utils/extractJwt");
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

module.exports = router;
