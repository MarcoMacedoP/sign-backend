const MongoClient = require("mongodb").MongoClient;
const {mongoURI, mongoDbName} = require("../config/");
const debug = require("debug")("app:mongodb");
/** Class for making easy making querys to mongodb.
 *
 */
class MongoLib {
  constructor(collection) {
    this.client = new MongoClient(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    this.dbName = mongoDbName;
    this.collection = collection;
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

  createOne(data) {
    return this.connect().then(db =>
      db
        .collection(this.collection)
        .insertOne(data)
        .then(result =>
          this.readOne(this.collection, {_id: result.insertedId})
        )
    );
  }

  readAll(query = {}) {
    return this.connect().then(db =>
      db
        .collection(this.collection)
        .find(query)
        .toArray()
    );
  }

  readOne(query = {}) {
    return this.connect().then(db =>
      db.collection(this.collection).findOne(query)
    );
  }
  removeOne(query = {}) {
    return this.connect().then(db =>
      db.collection(this.collection).deleteOne(query)
    );
  }
}
module.exports = MongoLib;