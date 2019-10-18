const router = require("express").Router();

const {getUserIDFromAccessToken} = require("../../utils/extractJwt");
//services
const TeamsUserServices = require("../../services/teams/teams-user");
//validate
const validate = require("../../utils/middlewares/validationHandler");
const {
  addUserSchema,
  removeUserSchema
} = require("../../utils/schemas/teams");
//utils
const {sendGoodResponse} = require("../../utils/responses");
/**
 * Get all the teams that a user haves
 */
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
/**
 * Get one team that a user haves
 */
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
/**
 * Update one team that a user haves
 */
router.put("/:teamId", async (req, res, next) => {
  const userId = getUserIDFromAccessToken(req);
  const {teamId} = req.params;
  const teamsUserServices = new TeamsUserServices();

  try {
    const team = await teamsUserServices.updateOne(
      userId,
      teamId,
      req.body
    );
    sendGoodResponse({
      response: res,
      message: "updated team",
      statusCode: 201,
      data: team
    });
  } catch (error) {
    next(error);
  }
});
/**
 * Detele one team that a user haves
 */
router.delete("/:teamId", async (req, res, next) => {
  const userId = getUserIDFromAccessToken(req);
  const {teamId} = req.params;
  const teamsUserServices = new TeamsUserServices();

  try {
    const team = await teamsUserServices.removeOne(userId, teamId);
    sendGoodResponse({
      response: res,
      message: "deleted team",
      data: team,
      statusCode: 201
    });
  } catch (error) {
    next(error);
  }
});
/**
 * Add a user to the team that a user haves
 */
router.patch(
  "/add_user/:teamId",
  validate(addUserSchema),
  async (req, res, next) => {
    const userId = getUserIDFromAccessToken(req);
    const {teamId} = req.params;
    const teamsUserServices = new TeamsUserServices();
    try {
      const updatedTeam = await teamsUserServices.addUserToTeam(
        teamId,
        userId,
        req.body
      );
      sendGoodResponse({
        response: res,
        message: "updated team",
        data: updatedTeam,
        statusCode: 201
      });
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  "/remove_user/:teamId",
  validate(removeUserSchema),
  async (req, res, next) => {
    const userId = getUserIDFromAccessToken(req);
    const {removedUser} = req.body;
    const {teamId} = req.params;
    const teamsUserServices = new TeamsUserServices();
    try {
      const updatedTeam = await teamsUserServices.removeUserFromTeam(
        teamId,
        userId,
        removedUser
      );
      sendGoodResponse({
        response: res,
        message: "removed user from team",
        data: updatedTeam,
        statusCode: 201
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
