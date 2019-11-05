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
  const userId = getUserIDFromAccessToken(req);
  const userProjectsServices = new UserProjectsServices(userId);

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
//get one projects that a user haves with the full information of the project
router.get("/user/:projectId", async (req, res, next) => {
  const userId = getUserIDFromAccessToken(req);
  const userProjectsServices = new UserProjectsServices(userId);
  const {projectId} = req.params;

  try {
    const projects = await userProjectsServices.getOneWithFullInfo(
      projectId,
      userId
    );
    sendGoodResponse({
      response: res,
      message: "get one user project!",
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
    const userId = getUserIDFromAccessToken(req);
    const userProjectsServices = new UserProjectsServices(userId);
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
//update a project for a user
router.put(
  "/user/:projectId",
  validate(createProjectSchema),
  async (req, res, next) => {
    const userId = getUserIDFromAccessToken(req);
    const userProjectsServices = new UserProjectsServices(userId);
    const {projectId} = req.params;
    try {
      const updatedProject = await userProjectsServices.updateOne(
        projectId,
        userId,
        req.body
      );
      sendGoodResponse({
        response: res,
        message: "updated a project!",
        statusCode: 201,
        data: updatedProject
      });
    } catch (error) {
      next();
    }
  }
);
//remove a project for a user
router.delete("/user/:projectId", async (req, res, next) => {
  const userId = getUserIDFromAccessToken(req);
  const userProjectsServices = new UserProjectsServices(userId);
  const {projectId} = req.params;
  try {
    await userProjectsServices.removeOne(projectId, userId);
    sendGoodResponse({
      response: res,
      message: "removed a project!",
      statusCode: 201
    });
  } catch (error) {
    next();
  }
});
module.exports = router;
