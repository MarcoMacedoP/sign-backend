const {ObjectId} = require("mongodb");
const MongoLib = require("../../lib/mongodb");
//services
const Projects = require("./projects");

//class
class UserProjects {
  constructor(userId) {
    this.mongodb = new MongoLib("projects");
    this.table = "user_projects";
    this.projectsServices = new Projects();
    this.userId = userId;
  }
  getOneWithFullInfo(projectId) {
    return this.projectsServices.getProjectWithFullInfo({
      userId: this.userId,
      _id: new ObjectId(projectId)
    });
  }
  getAll() {
    return this.projectsServices
      .getAll({userId: this.userId})
      .then((projects = []) => {
        const projectsPromises = projects.map(project =>
          this.getOneWithFullInfo(project._id)
        );
        return Promise.all(projectsPromises);
      });
  }
  createOne(projectData = {}) {
    return this.projectsServices.createOne({
      userId: this.userId,
      ...projectData
    });
  }
  updateOne(projectId, newProjectData = {}) {
    return this.projectsServices.updateOne(
      {userId: this.userId, _id: new ObjectId(projectId)},
      newProjectData
    );
  }
  removeOne(projectId) {
    return this.projectsServices.removeOne({
      _id: new ObjectId(projectId),
      userId: this.userId
    });
  }
}
module.exports = UserProjects;
