const fs = require("fs");
const {exec} = require("child_process");

function createFile(name) {
  console.log(__dirname);
  fs.writeFile(`../static/${name}.txt`, "", error => {
    if (error) {
      console.error("Error on createFile:", error);
    } else {
      console.log("archivo creado");
    }
  });
}

function readFiles() {
  const date = new Date();
  const day = date.getDate();
  const month = date
    .toLocaleString("default", {month: "short"})
    .toLowerCase();
  const hour = `${date.getHours()}:${date.getMinutes()}`;
  // console.log("year", year, "day", day, "hour", hour);
  exec("ls -l ../static/", (error, stdout) => {
    if (error) {
      console.error("Error reading files", error);
    } else {
      const regex = new RegExp(
        /^.*/ + `${month} ${day} ${hour}` + /.*$/
      );
      const ouput = stdout.match(regex);
      console.log(ouput);
      //sep 25 08:17
      console.log(stdout);
    }
  });
}

readFiles();
module.exports = {readFiles, createFile};
