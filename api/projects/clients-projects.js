const router = require("express").Router();
const debug = require("debug")("app:api:projects-clients");
const ClientsProjectsServices = require("../../services/projects/clients-projects");
//utils
const {sendGoodResponse} = require("../../utils/responses");
//validate
const validate = require("../../utils/middlewares/validationHandler");
const {
  clientProjectsSchema
} = require("../../utils/schemas/projects/clients-projects");

router.post(
  "/",
  validate(clientProjectsSchema),
  async (req, res, next) => {
    const {projectId, clientId} = req.body;
    debug(projectId, clientId);
    const clientsProjectsServices = new ClientsProjectsServices(
      projectId
    );
    try {
      const updatedProject = await clientsProjectsServices.addClient(
        clientId
      );
      sendGoodResponse({
        response: res,
        message: "added a client to project",
        statusCode: 201,
        data: updatedProject
      });
    } catch (error) {
      next(error);
    }
  }
);
router.delete(
  "/",
  validate(clientProjectsSchema),
  async (req, res, next) => {
    const {projectId, clientId} = req.body;
    const clientsProjectsServices = new ClientsProjectsServices(
      projectId
    );
    try {
      const updatedProject = await clientsProjectsServices.removeClient(
        clientId
      );
      sendGoodResponse({
        response: res,
        message: "removed a client of a  project",
        statusCode: 201,
        data: updatedProject
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
