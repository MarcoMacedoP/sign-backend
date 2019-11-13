const router = require("express").Router();
const TeamsAdminsServices = require("../../services/teams/teams-admins");
const {getUserIDFromAccessToken} = require("../../utils/extractJwt");
const {sendGoodResponse} = require("../../utils/responses");
const debug = require("debug")("app:api:teams-admins");

router.put("/:teamId", async (req, res, next) => {
  const {teamId} = req.params;
  debug(req.body);
  const teamsAdminsServices = new TeamsAdminsServices();
  try {
    const updatedTeam = await teamsAdminsServices.updateTeam({
      adminId: getUserIDFromAccessToken(req),
      teamId,
      data: req.body
    });

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

router.patch("/add_member/:teamId", async (req, res, next) => {
  const adminId = getUserIDFromAccessToken(req);
  const {userId} = req.body;
  const {teamId} = req.params;
  const teamsAdminsServices = new TeamsAdminsServices();
  try {
    const updatedTeam = await teamsAdminsServices.addUserToTeam({
      adminId,
      teamId,
      userId
    });
    sendGoodResponse({
      response: res,
      message: "added member to team!",
      statusCode: 201,
      data: updatedTeam
    });
  } catch (error) {
    next(error);
  }
});
router.patch("/remove_member/:teamId", async (req, res, next) => {
  const adminId = getUserIDFromAccessToken(req);
  const {userId} = req.body;
  const {teamId} = req.params;
  const teamsAdminsServices = new TeamsAdminsServices();
  try {
    const updatedTeam = await teamsAdminsServices.removeMemberOfATeam({
      adminId,
      teamId,
      userId
    });
    sendGoodResponse({
      response: res,
      message: "removed member of team",
      statusCode: 201,
      data: updatedTeam
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
