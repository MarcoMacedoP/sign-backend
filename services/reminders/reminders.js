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
      main                : "reminders",
      transitionClients   : "reminders_clients",
      transitionProviders : "reminders_providers"
    };
  }
  getOne(reminderId) {
    return this.read(this.tables.main, `WHERE reminder_id = ${reminderId}`);
  }
  async getAll({ clientId, providerId }) {
    //get the values of the reminders table
    // passing around the transition table (reminders_clients, reminders_providers, ...etc)

    //initial values
    let transitionTable;
    let transitionTableId;
    let transitionTableIdValue;
    const finalTableIdName = "reminder_id";
    const finalTable = this.tables.main;

    //set conditional values----------------
    if (clientId) {
      //get from transition tbale reminders_clients
      transitionTable = this.tables.transitionClients;
      transitionTableId = "client_id";
      transitionTableIdValue = clientId;
    }
    if (providerId) {
      transitionTable = this.tables.transitionProviders;
      transitionTableId = "provider_id";
      transitionTableIdValue = providerId;
    }
    //---------------------------

    //make the query
    const remindersQuery = await makeQueryFromTransitionTable(
      transitionTable,
      transitionTableId,
      transitionTableIdValue,
      finalTableIdName,
      finalTable
    );
    debug(remindersQuery);
    return this.query(remindersQuery); //return the promise with the query
  }

  async createOne(reminderData) {
    const {
      title,
      description,
      date,
      clientId = null,
      providerId = null
    } = reminderData;

    let rows = "(title, description, date)";
    let values = [ title, description, date ];

    // If no description insert without description.
    if (!description) {
      values = [ title, date ];
      rows = "(title, date)";
    }
    if (clientId || providerId) {
      //make reminder if theres an id
      const { insertId } = await this.create(this.tables.main, rows, values);

      //make relation between reminder and client
      if (clientId) {
        const clientRows = "(client_id, reminder_id)";
        const clientValues = [ clientId, insertId ];
        const reminderClient = await this.create(
          this.tables.transitionClients,
          clientRows,
          clientValues
        );
        return reminderClient;
      }

      //make relation between reminder and provider
      if (providerId) {
        const providerRows = "(provider_id, reminder_id)";
        const providerValues = [ providerId, insertId ];
        const createdReminder = await this.create(
          this.tables.transitionProviders,
          providerRows,
          providerValues
        );
        return { createdReminder };
      }
    }
    else {
      //Errror handler, there is no id
      throw Boom.badRequest("No id specified");
    }
  }
}
module.exports = RemindersService;
