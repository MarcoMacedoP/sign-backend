const router = require("express").Router();
const TeamsFounderServices = require("../../services/teams/teams-founder");
const { getUserIDFromAccessToken } = require("../../utils/extractJwt");
const { sendGoodResponse } = require("../../utils/responses");

router.delete("/:teamId", async (req, res, next) => {
  const founderId = getUserIDFromAccessToken(req);
  const { teamId } = req.params;
  const teamsFounderServices = new TeamsFounderServices();
  try {
    const updatedTeam = await teamsFounderServices.removeOne(founderId, teamId);
    sendGoodResponse({
      response: res,
      message: "update team",
      statusCode: 201,
      data: updatedTeam
    });
  } catch (error) {
    next(error);
  }
});

router.patch("/add_admin/:teamId", async (req, res, next) => {
  const teamsFounderServices = new TeamsFounderServices();
  const founderId = getUserIDFromAccessToken(req);
  const { teamId } = req.params;
  const { userId } = req.body;
  try {
    const project = await teamsFounderServices.addAdmin({
      founderId,
      teamId,
      userIdToBeAdmin: userId
    });
    sendGoodResponse({
      response: res,
      message: "added admin",
      statusCode: 201,
      data: project
    });
  } catch (error) {
    next(error);
  }
});

router.patch("/remove_admin/:teamId", async (req, res, next) => {
  const teamsFounderServices = new TeamsFounderServices();
  const founderId = getUserIDFromAccessToken(req);
  const { teamId } = req.params;
  const { adminId } = req.body;
  try {
    const project = await teamsFounderServices.removeAdmin({
      founderId,
      teamId,
      adminIdToBeRemoved: adminId
    });
    sendGoodResponse({
      response: res,
      message: "removed admin",
      statusCode: 201,
      data: project
    });
  } catch (error) {
    next(error);
  }
});
module.exports = router;
