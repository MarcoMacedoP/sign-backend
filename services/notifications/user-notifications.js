const NotificationsServices = require("./notifications");
const Boom = require("@hapi/boom");

class UserNotifications {
  constructor(userId) {
    this.notificationsServices = new NotificationsServices();
    this.userId = userId;
  }
  /**
   * Gets all the notification that a user haves, using ther user ID.
   */
  getAll() {
    const query = {userId: this.userId};
    return this.notificationsServices.readAll(query);
  }
  /**Insert a notification.
   * @param {*} data the data of the notification, title and description.
   *      All the data are required if one of those aren't provider they
   *       will throw an badRequest error.
   */
  insertOne({title, description}) {
    if (!title || !description) {
      throw Boom.badRequest("Incomplete data on insertOne method");
    } else {
      return this.notificationsServices.createOne({
        userId: this.userId,
        title,
        description
      });
    }
  }
}
module.exports = UserNotifications;
