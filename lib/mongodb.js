const MongoClient = require("mongodb").MongoClient;
const {mongoURI} = require("../config/");

MongoClient.connect(mongoURI, (error, result) => {
  if (error) throw error;
  if (result) console.log(result);
});
