const MongoClient = require("mongodb").MongoClient;
const {mongoURI, mongoDbName} = require("../config/");
const debug = require("debug")("app:mongodb");
/**
 *
 */
class MongoLib {
  constructor() {
    this.client = new MongoClient(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    this.dbName = mongoDbName;
  }
  connect() {
    return new Promise((resolve, reject) => {
      this.client.connect(error => {
        if (error) {
          reject(error);
        } else {
          debug("Connection to mongodb succesful");
          resolve(this.client.db(this.dbName));
        }
      });
    });
  }

  createOne(collection, data) {
    return this.connect().then(db =>
      db
        .collection(collection)
        .insertOne(data)
        .then(result =>
          this.readOne(collection, {_id: result.insertedId})
        )
    );
  }

  readAll(collection, query = {}) {
    return this.connect().then(db =>
      db
        .collection(collection)
        .find(query)
        .toArray()
    );
  }

  readOne(collection, query = {}) {
    return this.connect().then(db =>
      db.collection(collection).findOne(query)
    );
  }
}
module.exports = MongoLib;
