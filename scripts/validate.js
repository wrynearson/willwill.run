const fs = require("fs-extra");
const path = require("path");

const getActivities = require(`./activities`);

function validateActivities(activities) {
  fs.readdir(
    `${__dirname}/../data-prep/activities/transformed/`,
    (err, files) => {
      try {
        console.log("There are", files.length, "in the transformed folder");
        files.forEach((file) => {
          let fileID = path.parse(file).name;
          console.log("\nLoaded activity", fileID);
          let actID = parseInt(fileID);
          let activity = require(`${__dirname}/../data-prep/activities/transformed/${actID}.json`);
        });
      } catch (err) {
        console.log(err);
      }
    }
  );
}

module.exports = validateActivities;
