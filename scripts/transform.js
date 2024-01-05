const fs = require("fs");

// Testing this code with one activity. Later, load by id / filename
const activity = require(`${__dirname}/../data-prep/10379242967.json`);

// Get info from all activities.
const activities = require(`${__dirname}/../data-prep/activities.json`);
console.log(activities.length);
// console.log(activity);

// hardcoded for now
const actID = 10379242967;
for (var i = 0; i < activities.length; i++) {
  // look for the entry with a matching `code` value
  if (activities[i].id == actID) {
    // we found it
    // obj[i].name is the matched result
    console.log(
      "nice, the correct activity ID has been found. The increment in activities.json is",
      i
    );
  }
}

async function transform() {
  try {
    const length = activity[0].original_size;
    var activityGeoJSON = {};
    activityGeoJSON["id"] = activities[12].id;
    activityGeoJSON["name"] = activities[12].name;
    // run could be a street run or trail run. Could be useful to group all runs (street and trail together)
    activityGeoJSON["activity_theme"] = activities[12].type;
    // trail run is specified
    activityGeoJSON["activity_type"] = activities[12].sport_type;
    activityGeoJSON["start_time"] = activities[12].start_date_local;
    activityGeoJSON["timezone"] = activities[12].timezone;
    activityGeoJSON["utc_offset"] = activities[12].utc_offset;

    activityGeoJSON["country"] = activities[12].location_country;
    // "only me" = private, "followers_only" means semi-private, "everyone" = public
    activityGeoJSON["privacy"] = activities[12].visibility;

    activityGeoJSON["type"] = "FeatureCollection";
    activityGeoJSON["features"] = [];
    for (let i = 0; i < length; i++) {
      var newFeature = {
        type: "Feature",
        geometry: {
          type: "Point",
          // swap lat and lon (to test on geojson.io)
          coordinates: [activity[1].data[i][1], activity[1].data[i][0]],
        },
        properties: {
          // Use the "type" field to name the key for the new activityGeoJson
          [activity[0].type]: activity[0].data[i],
          //   [activity[1].type]: activity[1].data[i],
          [activity[2].type]: activity[2].data[i],
          [activity[3].type]: activity[3].data[i],
          [activity[4].type]: activity[4].data[i],
          [activity[5].type]: activity[5].data[i],
          [activity[6].type]: activity[6].data[i],
          // time
          [activity[7].type]:
            Date.parse(activityGeoJSON["start_time"]) +
            activity[7].data[i] * 1000,
        },
      };
      activityGeoJSON["features"].push(newFeature);
    }

    //   activityGeoJSON.push({
    //     watts: activity[0].data[i],
    //     latlng: activity[1].data[i],
    //     velocity: activity[2].data[i],
    //     cadence: activity[3].data[i],
    //     distance: activity[4].data[i],
    //     altitude: activity[5].data[i],
    //     heartrate: activity[6].data[i],
    //     time: activity[7].data[i],
    //   });
    // }
    // console.log(activityGeoJSON);

    fs.writeFileSync(
      `${__dirname}/../data-prep/10379242967_transformed.json`,
      JSON.stringify(activityGeoJSON)
    );
  } catch (error) {
    console.log(error);
  }
}

transform();
