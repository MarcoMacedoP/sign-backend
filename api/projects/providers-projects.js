const router = require("express").Router();
const ProviderProjectsServices = require("../../services/projects/providers-projects");
//utils
const {sendGoodResponse} = require("../../utils/responses");

router.post("/", async (req, res, next) => {
  const {projectId, providerId} = req.body;
  const providerProjectsServices = new ProviderProjectsServices(
    projectId
  );
  try {
    const updatedProject = await providerProjectsServices.addProvider(
      providerId
    );
    sendGoodResponse({
      response: res,
      message: "added a provider to project",
      statusCode: 201,
      data: updatedProject
    });
  } catch (error) {
    next(error);
  }
});
router.delete("/", async (req, res, next) => {
  const {projectId, providerId} = req.body;
  const providerProjectsServices = new ProviderProjectsServices(
    projectId
  );
  try {
    const updatedProject = await providerProjectsServices.removeProvider(
      providerId
    );
    sendGoodResponse({
      response: res,
      message: "removed a provider of a  project",
      statusCode: 201,
      data: updatedProject
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
