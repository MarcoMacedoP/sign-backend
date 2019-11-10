const router = require("express").Router();
const TeamsAdminsServices = require("../../services/teams/teams-admins");
const {getUserIDFromAccessToken} = require("../../utils/extractJwt");
const {sendGoodResponse} = require("../../utils/responses");

router.put("/:teamId", async (req, res, next) => {
  const userId = getUserIDFromAccessToken(req);
  const {teamId} = req.params;
  const teamsAdminsServices = new TeamsAdminsServices();
  try {
    const updatedTeam = await teamsAdminsServices.updateOne(
      userId,
      teamId,
      req.body
    );
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
    const updatedTeam = await teamsAdminsServices.addUserToTeam(
      adminId,
      teamId,
      userId
    );
    sendGoodResponse({
      response: res,
      message: "updates team",
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
    const updatedTeam = await teamsAdminsServices.removeUserOfMembers(
      adminId,
      teamId,
      userId
    );
    sendGoodResponse({
      response: res,
      message: "updated team",
      statusCode: 201,
      data: updatedTeam
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
