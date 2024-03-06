const fs = require("fs-extra");
const path = require("path");

const activities = require(`${__dirname}/../data-prep/activities.json`);

async function lookupFilesInDirectory(directoryPath) {
  try {
    const directory = await fs.readdir(directoryPath);
    let listActivities = [];

    for (const file of directory) {
      // turns filename string into number to match activity.id field
      const fileName = parseInt(path.parse(file).name);
      const foundActivity = activities.find((dict) => dict.id === fileName);
      if (foundActivity) {
        console.log("Found streamed activity:", foundActivity.name);
        listActivities.push({
          id: foundActivity.id,
          name: foundActivity.name,
          type: foundActivity.type,
          distance: foundActivity.distance,
          polyline: foundActivity.map.summary_polyline,
        });
      } else {
        console.log(`No activity found for file: ${fileName}`);
      }
    }

    fs.writeFileSync(
      `${__dirname}/../data-prep/activityList.json`,
      JSON.stringify(listActivities)
    );
  } catch (error) {
    console.log(error);
  }
}

lookupFilesInDirectory(`${__dirname}/../data-prep/activities/transformed`);
