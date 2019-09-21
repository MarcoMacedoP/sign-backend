const Marialib = require("../../lib/mariadb");

class Projects {
  constructor() {
    this.mariadb = new Marialib();
    this.table = "projects";
  }
  readOne({ projectId }) {
    return this.mariadb.read(this.table, `WHERE project_id = ${projectId}`);
  }
  readAll() {
    return this.mariadb.read(this.table);
  }
  createProject({ name, description }) {
    const rows = "(name, description)";
    const values = [name, description];

    return this.mariadb.create(this.table, rows, values);
  }
  updateProject({ projectId, name, description }) {
    const set = `name = '${name}', description = '${description}'`;
    const condition = `project_id = ${projectId}`;

    return this.mariadb.update(this.table, set, condition);
  }
}
module.exports = Projects;
