const fs = require("fs");
const path = require("path");

// fs.readdirSync(`${__dirname}/../data-prep/activities/streamed/`).forEach(
//   (file) => {
//     console.log(file);
//   }
// );

// hardcoded for now;
// const actID = 10456598855;

// Testing this code with one activity. Later, load by id / filename

// Get info from all activities.
const activities = require(`${__dirname}/../data-prep/activities.json`);
console.log("There are a total of", activities.length, "in activities.json");
// console.log(activity);

async function transform() {
  try {
    fs.readdir(
      `${__dirname}/../data-prep/activities/streamed/`,
      (err, files) => {
        try {
          console.log("There are", files.length, "in the streamed folder");
          files.forEach((file) => {
            let fileID = path.parse(file).name;
            console.log("\nLoaded activity", fileID);
            let actID = parseInt(fileID);
            let activity = require(`${__dirname}/../data-prep/activities/streamed/${actID}.json`);

            // load activity ID actID, find the related information in activities.json. Iterate through the number of streamed activities (files.length) in the streamed folder
            for (var k = 0; k < files.length; k++) {
              // set actID as the streamed activity ID, based on filename

              // look for the entry with a matching `code` value
              if (activities[k].id === actID) {
                // obj[i].name is the matched result
                console.log(
                  "Nice, the correct activity ID has been found in activities.json. The increment in activities.json is",
                  k
                );
                let incr = k;

                let length = activity[0].original_size;
                console.log(
                  "Length of",
                  actID,
                  "is",
                  activity[0].original_size
                );

                try {
                  var activityGeoJSON = {};
                  activityGeoJSON["id"] = activities[incr].id;
                  activityGeoJSON["name"] = activities[incr].name;
                  // run could be a street run or trail run. Could be useful to group all runs (street and trail together)
                  activityGeoJSON["activity_theme"] = activities[incr].type;
                  // trail run is specified
                  activityGeoJSON["activity_type"] =
                    activities[incr].sport_type;
                  activityGeoJSON["start_time"] =
                    activities[incr].start_date_local;
                  activityGeoJSON["timezone"] = activities[incr].timezone;
                  activityGeoJSON["utc_offset"] = activities[incr].utc_offset;

                  activityGeoJSON["country"] =
                    activities[incr].location_country;
                  // "only me" = private, "followers_only" means semi-private, "everyone" = public
                  activityGeoJSON["visibility"] = activities[incr].visibility;

                  activityGeoJSON["geojson"] = {};
                  activityGeoJSON["geojson"]["type"] = "FeatureCollection";
                  activityGeoJSON["geojson"]["features"] = [];
                } catch (error) {
                  console.log(error);
                }
                // Loop through activity to restructure all properties into one feature
                try {
                  console.log(
                    "Activity type length (number of different properties) is",
                    activity.length
                  );
                  for (let i = 0; i < length; i++) {
                    let newFeature = {
                      type: "Feature",
                      // geometry: {
                      //   type: "Point",
                      //   //   // swap lat and lon (to test on geojson.io)
                      //   //   coordinates: [activity[1].data[i][1], activity[1].data[i][0]],
                      // },

                      properties: {
                        //   Use the "type" field to name the key for the new activityGeoJson
                        //   [activity[0].type]: activity[0].data[i],
                        //     [activity[1].type]: activity[1].data[i],
                        //   [activity[2].type]: activity[2].data[i],
                        //   [activity[3].type]: activity[3].data[i],
                        //   [activity[4].type]: activity[4].data[i],
                        //   [activity[5].type]: activity[5].data[i],
                        //   [activity[6].type]: activity[6].data[i],
                        //   // time
                        //   [activity[7].type]:
                        //     Date.parse(activityGeoJSON["start_time"]) +
                        //     activity[7].data[i] * 1000,
                      },
                    };
                    for (let j = 0; j < activity.length; j++) {
                      if (activity[j].type === "latlng") {
                        newFeature["geometry"] = {
                          type: "Point",
                          coordinates: activity[j].data[i],
                        };
                      } else if (activity[j].type === "time") {
                        newFeature["properties"][activity[j].type] =
                          Date.parse(activityGeoJSON["start_time"]) +
                          activity[j].data[i] * 1000;
                      } else if (activity[j].type != null) {
                        newFeature["properties"][activity[j].type] =
                          activity[j].data[i];
                      } else {
                        newFeature["properties"][activity[j].type] = "ERROR";
                      }
                    }

                    activityGeoJSON["geojson"]["features"].push(newFeature);
                  }
                } catch (error) {
                  console.log(error);
                }

                console.log(`Writing ${actID}_t to the folder "transformed"`);

                fs.writeFileSync(
                  `${__dirname}/../data-prep/activities/transformed/${actID}_t.json`,
                  JSON.stringify(activityGeoJSON)
                );

                console.log(`Transformation of activity ${actID} complete`);
              }

              // this would send an error each time the actID didn't match the activity.json id...

              // else {
              //   console.log(
              //     "There was an error finding",
              //     actID,
              //     "in activities.json"
              //   );
              // }
            }
          });
        } catch {
          console.log(err);
        }
      }
    );
  } catch (error) {
    console.log("Hey, the error is", error);
  }
}

transform();
