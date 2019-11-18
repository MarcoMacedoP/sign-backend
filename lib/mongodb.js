const { MongoClient, ObjectId } = require("mongodb");
const { mongoURI, mongoDbName } = require("../config/");
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
    debug("connect()");
    return new Promise((resolve, reject) => {
      this.client.connect(error => {
        if (error) {
          reject(error);
        } else {
          debug(
            "Connection to mongodb succesful on collection " + this.collection
          );
          resolve(this.client.db(this.dbName));
        }
      });
    });
  }

  async createOne(data) {
    debug("createOne()");

    const db = await this.connect();
    const result = await db.collection(this.collection).insertOne(data);
    const createdData = await db.collection(this.collection).findOne({
      _id: new ObjectId(result.insertedId)
    });
    await this.client
      .close(true)
      .then(() => debug("closed mongodb connection"));
    return createdData;
  }

  readAll(query = {}) {
    debug("readAll()");
    return this.connect()
      .then(db =>
        db
          .collection(this.collection)
          .find(query)
          .toArray()
      )
      .then(async data => {
        await this.client
          .close()
          .then(() => debug("closed mongodb connection"));
        return data;
      });
  }

  readOne(query = {}) {
    debug("readOne()");

    return this.connect()
      .then(db => db.collection(this.collection).findOne(query))
      .then(async data => {
        await this.client
          .close()
          .then(() => debug("closed mongodb connection"));
        return data;
      });
  }
  readById(objectId) {
    debug("readById()");
    return this.readOne({ _id: new ObjectId(objectId) });
  }

  updateOne(query = {}, data = {}, operator = "$set") {
    debug("updateOne()");
    return this.connect().then(db =>
      db
        .collection(this.collection)
        .updateOne(query, { [operator]: { ...data } })
        .then(() =>
          db
            .collection(this.collection)
            .findOne({ ...data })
            .then(async result => {
              await this.client
                .close()
                .then(() => debug("closed mongodb connection"));
              return result;
            })
        )
    );
  }
  updateOneById(objectId, data = {}, operator = "$set") {
    debug("updateOneById()");
    return this.updateOne({ _id: new ObjectId(objectId) }, data, operator);
  }

  removeOne(query = {}) {
    debug("removeOne()");
    return this.connect()
      .then(db => db.collection(this.collection).deleteOne(query))
      .then(async result => {
        await this.client
          .close()
          .then(() => debug("closed mongodb connection"));
        return result;
      });
  }
  removeOneById(objectId) {
    debug("removeOneById()");
    return this.removeOne({ _id: new ObjectId(objectId) });
  }
}
module.exports = MongoLib;
