const MariaLib = require("../../lib/mariadb");
const debug = require("debug")("app:reminder-services");
const Boom = require("@hapi/boom");
//functions
const makeQueryFromTransitionTable = require("../../utils/makeQueryFromTransitionTable");

//the class
class RemindersService extends MariaLib {
  constructor() {
    super();
    this.tables = {
      main: "reminders",
      transitionClients: "reminders_clients",
      transitionProviders: "reminders_providers",
      transitionTeams: "reminders_teams",
      transitionProjects: "reminders_projects"
    };
    this.types = {
      CLIENTS: "CLIENTS",
      PROVIDERS: "PROVIDERS",
      PROJECTS: "PROJECTS",
      TEAMS: "TEAMS"
    };
    this.incorrectType = searchedType =>
      Boom.notFound(
        `searchedType: ${searchedType} is not a valid type!`
      );
  }
  getOne(reminderId) {
    return this.read(
      this.tables.main,
      `WHERE reminder_id = ${reminderId}`
    ).then(([reminder]) => reminder);
  }

  getAllFromUser(userId) {
    return this.read(
      this.tables.main,
      `WHERE user_id =${userId} AND active=1`
    );
  }
  /**
   * Gets all reminders using a transition table
   * transition table are used in reminders to make a relationship
   * between another entity (such as projects, teams, etc)
   * @param {String} transitionTable the name of the transition table
   * @param {String} transitionTableIdName the name of the field where is stored the id on transition table
   * @param {Number} transitionTableIdValue the value of the transition table id to be searched
   */
  async getAllFromTransitionTable({
    transitionTable,
    transitionTableIdName,
    transitionTableIdValue
  }) {
    const finalTableIdName = "reminder_id";
    const finalTable = this.tables.main;
    const aditionalFilters = "AND active=1";
    //make the query
    try {
      const remindersQuery = await makeQueryFromTransitionTable(
        transitionTable,
        transitionTableIdName,
        transitionTableIdValue,
        finalTableIdName,
        finalTable,
        aditionalFilters
      );
      return this.query(remindersQuery);
    } catch (error) {
      debug(error);
      return [];
    }
  }
  /**
   * Gets all reminders using another param that is not the user ID.
   * @param {*} type
   * @param {*} typeId
   */
  getAllNotFromUser(searchedType, searchedId) {
    const {PROJECTS, TEAMS, CLIENTS, PROVIDERS} = this.types;
    switch (searchedType) {
      case PROJECTS:
        return [];
      case TEAMS:
        return [];
      case CLIENTS:
        return this.getAllFromTransitionTable({
          transitionTable: this.tables.transitionClients,
          transitionTableIdName: "client_id",
          transitionTableIdValue: searchedId
        });
      case PROVIDERS:
        return this.getAllFromTransitionTable({
          transitionTable: this.tables.transitionProviders,
          transitionTableIdName: "provider_id",
          transitionTableIdValue: searchedId
        });

      default:
        throw this.incorrectType(searchedType);
    }
  }
  /** Create a reminder and make a relationship with a
   * defined type
   *
   * @param {String} type the type to make the relation
   * @param {*} reminderData the reminder data
   */
  async createNotFromUser(type, reminderData) {
    const {PROJECTS, TEAMS, CLIENTS, PROVIDERS} = this.types;
    const {typeId} = reminderData;

    const reminder = await this.createOne(reminderData);
    const {reminder_id} = reminder;

    switch (type) {
      case PROJECTS:
        return this.create(
          this.tables.transitionProjects,
          `( "project_id", reminder_id)`,
          [typeId, reminder_id]
        ).then(() => reminder);

      case TEAMS:
        return this.create(
          this.tables.transitionTeams,
          `( team_id, reminder_id)`,
          [typeId, reminder_id]
        ).then(() => reminder);

      case CLIENTS:
        return this.create(
          this.tables.transitionClients,
          `(client_id, reminder_id)`,
          [typeId, reminder_id]
        ).then(() => reminder);

      case PROVIDERS:
        return this.create(
          this.tables.transitionProviders,
          `( provider_id, reminder_id)`,
          [typeId, reminder_id]
        ).then(() => reminder);

      default:
        throw this.incorrectType(type);
    }
  }

  /**Creates a reminder
   * @param {*} reminderData
   */
  createOne(reminderData) {
    const {title, description, date, userId} = reminderData;

    let rows = "(title, description, date, user_id)";
    let values = [title, description, date, userId];

    // If no description insert without description.
    if (!description) {
      rows = "(title, date, user_id)";
      values = [title, date, userId];
    }
    return this.create(this.tables.main, rows, values).then(
      ({insertId}) => this.getOne(insertId)
    );
  }

  updateOne({reminderId, title, description, date}) {
    let set = `title='${title}', description='${description}', date='${date})'`;

    // If no description insert without description.
    if (!description) {
      set = `title='${title}', date='${date})'`;
    }
    return this.update(
      this.tables.main,
      set,
      `reminder_id=${reminderId}`
    ).then(() => this.getOne(reminderId));
  }
  remove(reminderId) {
    return this.update(
      this.tables.main,
      `active = 0`,
      `reminder_id=${reminderId}`
    );
  }
}
module.exports = RemindersService;
