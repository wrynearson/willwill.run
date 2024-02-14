// Stream individual activity (but can loop over them)

const strava = require("strava-v3");

const fs = require("fs-extra");
// const path = require("path");

const getCredentials = require("./auth");
const transformActivity = require("./transform");

async function streamActivity(activities) {
  console.log(
    "Attempting to stream each activity from Strava that isn't already saved in the streamed folder."
  );
  for (let i = 0; i < activities.length; i++) {
    const actID = activities[i].id;
    const fileExists = fs.existsSync(
      `${__dirname}/../data-prep/activities/streamed/${actID}.json`
    );

    if (fileExists) {
      continue;
    }

    console.log("Fetching activity", actID);

    try {
      const credentials = await getCredentials();
      const activity = await strava.streams.activity({
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

      const transformedActivity = transformActivity(activities[i], activity);

      console.log("Saving activity", actID);

      await fs.writeJSON(
        `${__dirname}/../data-prep/activities/transformed/${actID}.json`,
        transformedActivity
      );
    } catch (error) {
      console.log(
        "An error occurred with fetching the activity stream:",
        error.error.message,
        "| Status code:",
        error.statusCode
      );

      // statusCode 429 means the rate limit was exceeded
      if (error.statusCode === 404) {
        continue;
      } else {
        console.log(
          "Exiting with an error code of",
          error.statusCode,
          ": ",
          error.error.message
        );
        process.exit(1);
      }
    }
  }

  console.log(
    "Current Strava rate limit (0-1, 1=exceeded)",
    strava.rateLimiting.fractionReached()
  );
}

module.exports = streamActivity;
