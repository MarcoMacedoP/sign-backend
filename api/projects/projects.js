const express = require("express");
const router = express.Router();
const debug = require("debug")("app:api:projects");

//services 
const ProjectsServices = require("../../services/products/products");
//utils
const { extractUserFromJWT } = require("../../utils/extractJwt")
const {sendGoodResponse} = require ("../../utils/responses/")


/**get a project */
router.get("/:projectId",async (req, res, next) => {
    const projectsServices =  new ProjectsServices();
    const userId = extractUserFromJWT(req);
    const {projectId} = req.params;
    try {
        const project = await projectsServices.getProject({projectId, userId});
        sendGoodResponse({res, message: "get a project", statusCode: 200, data: project});

    } catch (error) {
        next(error);
    }

})

/** Create a project */
router.post("/", async (req, res, next) => {
    const projectsServices =  new ProjectsServices();
    const userId = extractUserFromJWT(req);
    try {
        const project = await projectsServices.createProject({...req.body, userId});
        sendGoodResponse({res, message: "created project", statusCode: 200, data: project});

    } catch (error) {
        next(error);
    }
    
});

/** Update a project */
router.patch("/:projectId", async (req, res, next) => {
    const projectsServices =  new ProjectsServices();
    const userId = extractUserFromJWT(req);
    const {projectId} = req.params;
    try {
        const project = await projectsServices.updateProject({...req.body, userId, projectId});
        sendGoodResponse({res, message: "updated project", statusCode: 201, data: project});
    } catch (error) {
        next(error);
    }
    
});
/** delete a project */
router.post("/:projectId", async (req, res, next) => {
    const projectsServices =  new ProjectsServices();
    const userId = extractUserFromJWT(req);
    const {projectId} = req.params;
    try {
        const project = await projectsServices.createProject({ projectId, userId });
        sendGoodResponse({res, message: "deleted project", statusCode: 202, data: project});
    } catch (error) {
        next(error);
    }
    
});
module.exports = router;