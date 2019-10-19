const router = require("express").Router();
//services
const ProjectActivitiesServices = require("../../services/projects/project-activities");
//validate
const validate = require("../../utils/middlewares/validationHandler");
const {
  createActivitieSchema,
  projectIdSchema
} = require("../../utils/schemas/projects/activities-projects");
//utils
const {sendGoodResponse} = require("../../utils/responses");
//create an activitie for a project
router.post(
  "/:projectId",
  validate({projectId: projectIdSchema}, "params"),
  validate(createActivitieSchema),
  async (req, res, next) => {
    const projectActivitiesServices = new ProjectActivitiesServices();
    const {projectId} = req.params;
    try {
      const projectWithAddedActivite = await projectActivitiesServices.createOne(
        projectId,
        req.body
      );
      sendGoodResponse({
        response: res,
        message: "added activitie to project!",
        statusCode: 201,
        data: projectWithAddedActivite
      });
    } catch (error) {
      next(error);
    }
  }
);
module.exports = router;
