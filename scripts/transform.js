const fs = require("fs");

// Testing this code with one activity. Later, load by id / filename
const activity = require(`${__dirname}/../data-prep/activities/10379242967.json`);

// Get info from all activities.
const activities = require(`${__dirname}/../data-prep/activities.json`);
console.log("There are a total of", activities.length, "in activities.json");
// console.log(activity);

async function transform() {
  try {
    // load activity ID actID, find the related information in activities.json
    // hardcoded for now
    const actID = 10379242967;
    for (var i = 0; i < activities.length; i++) {
      // look for the entry with a matching `code` value
      if (activities[i].id === actID) {
        // we found it
        // obj[i].name is the matched result
        console.log(
          "Nice, the correct activity ID has been found in activities.json. The increment in activities.json is",
          i
        );
        let incr = i;

        const length = activity[0].original_size;
        console.log("Length of", actID, "is", activity[0].original_size);
        var activityGeoJSON = {};

        try {
          activityGeoJSON["id"] = activities[incr].id;
          activityGeoJSON["name"] = activities[incr].name;
          // run could be a street run or trail run. Could be useful to group all runs (street and trail together)
          activityGeoJSON["activity_theme"] = activities[incr].type;
          // trail run is specified
          activityGeoJSON["activity_type"] = activities[incr].sport_type;
          activityGeoJSON["start_time"] = activities[incr].start_date_local;
          activityGeoJSON["timezone"] = activities[incr].timezone;
          activityGeoJSON["utc_offset"] = activities[incr].utc_offset;

          activityGeoJSON["country"] = activities[incr].location_country;
          // "only me" = private, "followers_only" means semi-private, "everyone" = public
          activityGeoJSON["visibility"] = activities[incr].visibility;

          activityGeoJSON["type"] = "FeatureCollection";
          activityGeoJSON["features"] = [];
        } catch (error) {
          console.log(error);
        }
        // Loop through activity to restructure all properties into one feature
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

        console.log(`Writing ${actID}_t to the folder "transformed"`);

        fs.writeFileSync(
          `${__dirname}/../data-prep/activities/transformed/${actID}_t.json`,
          JSON.stringify(activityGeoJSON)
        );

        console.log(`Transformation of activity ${actID} complete`);
      }
    }
  } catch (error) {
    console.log("Hey, the error is", error);
  }
}

transform();
