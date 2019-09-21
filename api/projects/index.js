const router = require("express").Router();
const ProjectServices = require("../../services/projects/");
const debug = require("debug")("app:api:projects");

router.get("/:projectId", async (req, res, next) => {
  const projectServices = new ProjectServices();
  const { projectId } = req.params;
  try {
    const project = await projectServices.readOne({ projectId });
    res.status(200).json({ project });
  } catch (error) {
    next(error);
  }
});
router.get("/", async (req, res, next) => {
  const projectServices = new ProjectServices();

  try {
    const projects = await projectServices.readAll();
    res.status(200).json({ projects });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  const projectServices = new ProjectServices();
  const { name, description } = req.body;
  try {
    const project = await projectServices.createProject({ name, description });
    res.status(200).json({ project });
  } catch (error) {
    next(error);
  }
});

router.patch("/:projectId", async (req, res, next) => {
  const projectServices = new ProjectServices();
  const { name, description } = req.body;
  const { projectId } = req.params;

  debug(projectId);

  try {
    const updatedProject = await projectServices.updateProject({
      projectId,
      name,
      description
    });
    res.status(200).json({ updatedProject });
  } catch (error) {
    next(error);
  }
});
module.exports = router;
