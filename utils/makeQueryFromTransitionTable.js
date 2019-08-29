/*
        @author: Marco Macedo
        @description: THis functions take values from a transition table
                    to a string query that can be used to bring all the values
                    of the final table

*/

const MariaLib = require("../lib/mariadb");
const debug = require("debug")("app:makeQueryFromTransitionTable");
async function makeQueryFromTransitionTable(
  transitionTable,
  transitionTableId,
  transitionTableIdValue,
  finalTableIdName,
  finalTable
) {
  //validation stuff-------------
  if (
    !transitionTable ||
    !transitionTableId ||
    !transitionTableIdValue ||
    !finalTableIdName ||
    !finalTable
  ) {
    throw new Error("Some argument is null or undefined on transition query!");
  }
  //validation end---------------

  const mariadb = new MariaLib();
  const query = `SELECT ${finalTableIdName} FROM ${transitionTable} WHERE ${transitionTableId} = ${transitionTableIdValue}`;
  //get values of transition table
  const transitionsTableValues = await mariadb.query(query);
  //get final final id
  const finalTableIds = makeIdsForQuery(transitionsTableValues);

  const finalQuery = `SELECT * FROM ${finalTable} WHERE ${finalTableIdName} IN ${finalTableIds}`;
  return finalQuery;
}

function makeIdsForQuery(transitionsTableValues) {
  //This function recieve the transition table values
  // and return a string that can be used in the query

  const ids = transitionsTableValues.map((transitionValue) =>
    //make an array with the each object values,
    // actually it just gonna be one value,
    // because we limited that on row value in makeQueryFromTransitionTable()
    Object.values(transitionValue)
  );
  //now just add the ","
  let formatedIds = "";
  ids.forEach((element) => {
    formatedIds += `${element},`;
  });
  // remove the last one (or we are going to recieve an SQl error)
  //and add the "()"
  const finalIdsString = `(${formatedIds.slice(0, formatedIds.length - 1)})`;
  //this will return something like this "(8,12,14)",  wich are se searched ids.
  return finalIdsString;
}
module.exports = makeQueryFromTransitionTable;
