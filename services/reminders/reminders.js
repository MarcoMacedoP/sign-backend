const MariaLib = require("../../lib/mariadb");
const debug = require("debug")("app:reminder-services");
const Boom = require("@hapi/boom");

class RemindersService extends MariaLib {
  constructor() {
    super();
    this.tables = {
      main                : "reminders",
      transitionClients   : "reminders_clients",
      transitionProviders : "reminders_providers"
    };
  }

  async createOne({
    title,
    description,
    date,
    clientId = null,
    providerId = null
  }) {
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
