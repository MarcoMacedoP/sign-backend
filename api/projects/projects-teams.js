const router = require("express").Router();
//services
const TeamsProjectsServices = require("../../services/projects/projects-teams");
//validation
const validate = require("../../utils/middlewares/validationHandler");
const {
  addTeamToProjectSchema,
  removeTeamInProjectSchema
} = require("../../utils/schemas/projects/teams-projects");
//utils
const { sendGoodResponse } = require("../../utils/responses");
//*********************endpoints**************************/
//add team to project
router.post("/", validate(addTeamToProjectSchema), async (req, res, next) => {
  const { projectId, teamId } = req.body;
  const teamsProjectsServices = new TeamsProjectsServices();
  try {
    const project = await teamsProjectsServices.addTeamToProject(
      teamId,
      projectId
    );
    sendGoodResponse({
      response: res,
      data: project,
      statusCode: 201,
      message: "added team to project"
    });
  } catch (error) {
    next(error);
  }
});
//remove team to project
router.delete(
  "/",
  validate(removeTeamInProjectSchema),
  async (req, res, next) => {
    const { projectId, teamId } = req.body;
    const teamsProjectsServices = new TeamsProjectsServices();
    try {
      const project = await teamsProjectsServices.removeTeamInProject(
        teamId,
        projectId
      );
      sendGoodResponse({
        response: res,
        data: project,
        statusCode: 201,
        message: "removed team to project"
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
