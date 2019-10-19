const router = require("express").Router();
const UserProjectsServices = require("../../services/projects/user-projects");
//utils
const {getUserIDFromAccessToken} = require("../../utils/extractJwt");
const {sendGoodResponse} = require("../../utils/responses");
//validate
const validate = require("../../utils/middlewares/validationHandler");
const {
  createProjectSchema
} = require("../../utils/schemas/projects/user-projects");
//get all projects that a user haves
router.get("/user/", async (req, res, next) => {
  const userProjectsServices = new UserProjectsServices();
  const userId = getUserIDFromAccessToken(req);

  try {
    const projects = await userProjectsServices.getAll(userId);
    sendGoodResponse({
      response: res,
      message: "get all user projects!",
      statusCode: 200,
      data: projects
    });
  } catch (error) {
    next(error);
  }
});
//create a project for a user
router.post(
  "/user/",
  validate(createProjectSchema),
  async (req, res, next) => {
    const userProjectsServices = new UserProjectsServices();
    const userId = getUserIDFromAccessToken(req);
    try {
      const project = await userProjectsServices.createOne(
        userId,
        req.body
      );
      sendGoodResponse({
        response: res,
        message: "created a project!",
        statusCode: 200,
        data: project
      });
    } catch (error) {
      next(error);
    }
  }
);
module.exports = router;
