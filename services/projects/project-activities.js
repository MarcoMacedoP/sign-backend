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
  /**Update an activitie inside a project.
   * first, search the activitie id on the project activities
   * usign the projectId, once it find it's update the info.
   *
   * @param {*} projectId  the _id to be searched on projects
   * @param {*} activitieId  the activitie _id to be searched in projects
   * @param {*} newActiviteData the new data to be added to activitie
   */
  async updateOne(projectId, activitieId, newActiviteData) {
    const {activities} = await this.projectsServices.getOneById(
      projectId
    );
    const activitieIndex = activities.findIndex(activitie =>
      activitie._id.equals(activitieId)
    );

    if (activitieIndex === -1) {
      throw this.errors.activitieNotFound;
    } else {
      const updatedActivite = {
        ...activities[activitieIndex],
        ...newActiviteData
      };
      const updatedActivities = activities.filter(activitie =>
        activitie._id.equals(activitieId)
      );
      return this.projectsServices.updateOne(
        {_id: new ObjectId(projectId)},
        {activities: [...updatedActivities, updatedActivite]}
      );
    }
  }
  /**Changes the status of the activitie.
   * @param {*} projectId  the _id to be searched on projects
   * @param {*} activitieId  the activitie _id to be searched in projects
   * @param {*} status the new status to be changed
   */
  changeStatus({projectId, activitieId, status}) {
    return this.updateOne(projectId, activitieId, {status});
  }
}
module.exports = ProjectActivities;
