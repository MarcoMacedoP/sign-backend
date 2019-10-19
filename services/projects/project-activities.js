const {ObjectId} = require("mongodb");
const ProjectsServices = require("./projects");
const Boom = require("@hapi/boom");
class ProjectActivities {
  constructor() {
    this.projectsServices = new ProjectsServices();

    this.errors = {
      activitieNotFound: Boom.notFound("Activitie not found!")
    };
  }
  /**
   * Create an activitie inside a project :)
   * Get the project by his id an then add the activitie
   * without removing the others project activities
   * @param {*} projectId the project in where activitie are going to be added
   * @param {*} activitieData the data of the actitivie
   */
  createOne(projectId, activitieData) {
    return this.projectsServices.getOneById(projectId).then(project =>
      this.projectsServices.updateOne(
        {_id: new ObjectId(projectId)},
        {
          activities: [
            ...project.activities,
            {_id: new ObjectId(), ...activitieData}
          ]
        }
      )
    );
  }
  async updateOne(projectId, actitivieId, newActiviteData) {
    const {activities} = await this.projectsServices.getOneById(
      projectId
    );
    const activitieIndex = activities.findIndex(
      activitie => activitie._id === actitivieId
    );
    if (activitieIndex === -1) {
      throw this.errors.activitieNotFound;
    } else {
      const updatedActivite = {
        ...activities[activitieIndex],
        ...newActiviteData
      };
      const updatedActivities = activities.filter(
        activitie => activitie._id !== actitivieId
      );
      return this.projectsServices.updateOne(
        {_id: new ObjectId(projectId)},
        {activities: [...updatedActivities, updatedActivite]}
      );
    }
  }
  changeStatus(projectId, actitivieId, status) {
    return this.updateOne(projectId, actitivieId, {status});
  }
}
module.exports = ProjectActivities;
