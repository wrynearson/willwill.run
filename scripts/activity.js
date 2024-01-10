// Stream individual activity (but can loop over them)

const strava = require("strava-v3");

const fs = require("fs");
// const path = require("path");

const credentials = require(`${__dirname}/../credentials.json`);

const activities = require(`${__dirname}/../data-prep/activities.json`);

async function streamActivity() {
  try {
    // change to i < activities.length when ready to stream all activities, or i < 5 to just stream a few
    for (let i = 0; i < activities.length; i++) {
      const actID = activities[i].id;
      const fileExists = fs.existsSync(
        `${__dirname}/../data-prep/activities/streamed/${actID}.json`
      );

      if (fileExists) {
        console.log(`${actID} already found in streamed folder`);
        continue;
      }

      console.log("Fetching activity", actID);
      try {
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
      } catch (error) {
        console.log(
          "An error occurred with fetching the activity stream:",
          error.error.message,
          "| Status code:",
          error.statusCode
        );
        // statusCode 429 means the rate limit was exceeded
        if (error.statusCode === 404) {
          console.log("didn't find this one...");
          continue;
        } else {
          process.exit(1);
        }
      }
      console.log("Saving activity", actID);
      try {
        fs.writeFileSync(
          `${__dirname}/../data-prep/activities/streamed/${actID}.json`,
          JSON.stringify(activity)
        );
      } catch (error) {
        console.log("an error occurred when writing the file:", error);
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
