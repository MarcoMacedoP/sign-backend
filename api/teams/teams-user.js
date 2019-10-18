const router = require("express").Router();

const {getUserIDFromAccessToken} = require("../../utils/extractJwt");
//services
const TeamsUserServices = require("../../services/teams/teams-user");
//utils
const {sendGoodResponse} = require("../../utils/responses");

router.get("/", async (req, res, next) => {
  const userId = getUserIDFromAccessToken(req);
  const teamsUserServices = new TeamsUserServices();

  try {
    const teams = await teamsUserServices.getAll(userId);
    sendGoodResponse({
      response: res,
      message: "get all the teams",
      statusCode: 200,
      data: teams
    });
  } catch (error) {
    next(error);
  }
});
router.get("/:teamId", async (req, res, next) => {
  const userId = getUserIDFromAccessToken(req);
  const {teamId} = req.params;
  const teamsUserServices = new TeamsUserServices();

  try {
    const team = await teamsUserServices.getOne(userId, teamId);
    sendGoodResponse({
      response: res,
      message: "get one teams",
      statusCode: 200,
      data: team
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
