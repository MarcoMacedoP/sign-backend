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
          }).then(async readed => {
            await this.client
              .close()
              .then(() => debug("closed mongodb connection"));
            return readed;
          })
        )
    );
  }

  readAll(query = {}) {
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
    return this.readOne({_id: new ObjectId(objectId)});
  }

  updateOne(query = {}, data = {}, operator = "$set") {
    return this.connect().then(db =>
      db
        .collection(this.collection)
        .updateOne(query, {[operator]: {...data}})
        .then(() =>
          this.readOne({
            ...data
          }).then(async data => {
            await this.client
              .close()
              .then(() => debug("closed mongodb connection"));
            return data;
          })
        )
    );
  }
  updateOneById(objectId, data = {}, operator = "$set") {
    return this.updateOne(
      {_id: new ObjectId(objectId)},
      data,
      operator
    );
  }

  removeOne(query = {}) {
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
    return this.removeOne({_id: new ObjectId(objectId)});
  }
}
module.exports = MongoLib;
