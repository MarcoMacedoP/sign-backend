const {MongoClient, ObjectId} = require("mongodb");
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
          this.readOne({
            _id: result.insertedId
          })
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
  readById(objectId) {
    return this.readOne({_id: new ObjectId(objectId)});
  }

  updateOne(query = {}, data = {}) {
    return this.connect().then(db =>
      db
        .collection(this.collection)
        .updateOne(query, {$set: data})
        .then(() => {
          return this.readOne({
            ...data
          });
        })
    );
  }
  updateOneById(objectId, data = {}) {
    return this.updateOne({_id: new ObjectId(objectId)}, data);
  }

  removeOne(query = {}) {
    return this.connect().then(db =>
      db.collection(this.collection).deleteOne(query)
    );
  }
  removeOneById(objectId) {
    return this.removeOne({_id: new ObjectId(objectId)});
  }
}
module.exports = MongoLib;
