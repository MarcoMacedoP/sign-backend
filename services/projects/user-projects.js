const {ObjectId} = require("mongodb");
const MongoLib = require("../../lib/mongodb");
//services
const Projects = require("./projects");

//class
class UserProjects {
  constructor() {
    this.mongodb = new MongoLib("projects");
    this.table = "user_projects";
    this.projectsServices = new Projects();
  }
  getAll(userId) {
    return this.projectsServices.getAll({userId});
  }
  createOne(userId, projectData = {}) {
    return this.projectsServices.createOne({userId, ...projectData});
  }
  updateOne(projectId, userId, newProjectData = {}) {
    return this.projectsServices.updateOne(
      {userId, _id: new ObjectId(projectId)},
      newProjectData
    );
  }
  removeOne(projectId, userId) {
    return this.projectsServices.removeOne({
      _id: new ObjectId(projectId),
      userId
    });
  }
}
module.exports = UserProjects;
