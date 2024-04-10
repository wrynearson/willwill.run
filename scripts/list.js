const fs = require("fs-extra");
const path = require("path");

async function lookupFilesInDirectory(directoryPath) {
  try {
    const activities = await fs.readJSON(
      `${__dirname}/../data-prep/activities.json`
    );

    const directory = await fs.readdir(directoryPath);
    let listActivities = [];

    for (const file of directory) {
      // turns filename string into number to match activity.id field
      const fileName = parseInt(path.parse(file).name);
      const foundActivity = activities.find((dict) => dict.id === fileName);
      if (foundActivity) {
        if (
          foundActivity.distance > 0 &&
          foundActivity.visibility === "everyone" &&
          foundActivity.type === "Run"
        ) {
          console.log(
            `${foundActivity.name} is a public run with a distance > 0`
          );
          listActivities.push({
            id: foundActivity.id,
            date: foundActivity.start_date,
            name: foundActivity.name,
            type: foundActivity.type,
            sport_type: foundActivity.sport_type,
            distance: foundActivity.distance,
          });
        }
      } else {
        console.log(`No activity found for file: ${fileName}`);
      }
    }

    await fs.writeJSON(
      `${__dirname}/../src/data/activity_list.json`,
      listActivities.sort((a, b) => new Date(b.date) - new Date(a.date))
    );
  } catch (error) {
    console.log(error);
  }
}

lookupFilesInDirectory(`${__dirname}/../public/data/activities/transformed/`);
