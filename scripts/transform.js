const fs = require("fs");

const activity = require(`${__dirname}/../data-prep/10379242967.json`);
// console.log(activity);

async function transform() {
  try {
    const length = activity[0].original_size;
    var newActivity = [];
    for (let i = 0; i < length; i++) {
      newActivity.push({
        watts: activity[0].data[i],
        latlng: activity[1].data[i],
        velocity: activity[2].data[i],
        cadence: activity[3].data[i],
        distance: activity[4].data[i],
        altitude: activity[5].data[i],
        heartrate: activity[6].data[i],
        time: activity[7].data[i],
      });
    }
    console.log(newActivity);
  } catch (error) {
    console.log(error);
  }
}

transform();
