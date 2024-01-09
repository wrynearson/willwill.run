// Stream individual activity (but can loop over them)

const strava = require("strava-v3");

const fs = require("fs");
// const path = require("path");

const credentials = require(`${__dirname}/../credentials.json`);

const activities = require(`${__dirname}/../data-prep/activities.json`);

async function streamActivity() {
  // temporarily hardcode individual activity ID

  try {
    // change to i < activities.length when ready to stream all activities, or i < 5 to just stream a few
    for (let i = 200; i < activities.length; i++) {
      let actID = activities[i].id;
      let fileExists = fs.existsSync(
        `${__dirname}/../data-prep/activities/streamed/${actID}.json`
      );
      console.log(actID, "fileExists", fileExists);
      if (fileExists === false) {
        console.log("Fetching activity", actID);
        var activity = await strava.streams.activity({
          access_token: credentials.access_token,
          id: activities[i].id,
          // Try as many "types" (fields of information) as possible
          types: [
            "distance",
            "altitude",
            "latlng",
            "time",
            "heartrate",
            "velocity_smooth",
            "watts",
            "temp",
            "cadence",
          ],
        });
        console.log("Saving activity", actID);
        fs.writeFileSync(
          `${__dirname}/../data-prep/activities/streamed/${actID}.json`,
          JSON.stringify(activity)
        );
      } else if (fileExists === true) {
        console.log(`${actID} already found in streamed folder`);
      } else {
        console.log("Something went wrong...");
      }
    }
  } catch (error) {
    console.log(error);
  }
  console.log(
    "Current Strava rate limit (0-1, 1=exceeded)",
    strava.rateLimiting.fractionReached()
  );
}

streamActivity();
