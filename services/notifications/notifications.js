const MongoLib = require("../../lib/mongodb");

class NotificationsServices extends MongoLib {
  constructor() {
    super("notifications");
  }
}
module.exports = NotificationsServices;
