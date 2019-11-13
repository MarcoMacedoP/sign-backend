const router = require("express").Router();

const {getUserIDFromAccessToken} = require("../../utils/extractJwt");
//services
const TeamsMembersServices = require("../../services/teams/teams-members");
//validate
const validate = require("../../utils/middlewares/validationHandler");
const {teamsSchema, getTeamShema} = require("../../utils/schemas/teams/teams");
//utils
const {sendGoodResponse} = require("../../utils/responses");
/**
 * Get all the teams that a user haves
 */
router.get("/", async (req, res, next) => {
  const userId = getUserIDFromAccessToken(req);
  const teamsMembersServices = new TeamsMembersServices();

  try {
    const teams = await teamsMembersServices.getAll(userId);
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

router.post("/", validate(teamsSchema), async (req, res, next) => {
  const teamsMembersServices = new TeamsMembersServices();
  const userId = getUserIDFromAccessToken(req);
  try {
    const team = await teamsMembersServices.insertOne(userId, req.body);
    sendGoodResponse({
      response: res,
      message: "created team",
      statusCode: 200,
      data: team
    });
  } catch (error) {
    next(error);
  }
});
/**
 * Get one team that a user haves
 */
router.get(
  "/:teamId",
  validate(getTeamShema, "params"),
  async (req, res, next) => {
    const {teamId} = req.params;
    const teamsMembersServices = new TeamsMembersServices();

    try {
      const team = await teamsMembersServices.getOne(teamId);
      sendGoodResponse({
        response: res,
        message: "get one teams",
        statusCode: 200,
        data: team
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
