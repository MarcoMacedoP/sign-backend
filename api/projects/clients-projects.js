const router = require("express").Router();
const ClientsProjectsServices = require("../../services/projects/clients-projects");
//utils
const {sendGoodResponse} = require("../../utils/responses");

router.post("/", async (req, res, next) => {
  const {projectId, clientId} = req.body;
  const clientsProjectsServices = new ClientsProjectsServices(
    projectId
  );
  try {
    const updatedProject = clientsProjectsServices.addClient(
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
});
router.delete("/", async (req, res, next) => {
  const {projectId, clientId} = req.body;
  const clientsProjectsServices = new ClientsProjectsServices(
    projectId
  );
  try {
    const updatedProject = clientsProjectsServices.removeClient(
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
});

module.exports = router;
