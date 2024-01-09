// Stream individual activity (but can loop over them)

const strava = require("strava-v3");

const fs = require("fs");

const credentials = require(`${__dirname}/../credentials.json`);

const activities = require(`${__dirname}/../data-prep/activities.json`);

async function streamActivity() {
  // temporarily hardcode individual activity ID

  try {
    // change to i < activity.length when ready to stream all activities
    for (let i = 0; i < 5; i++) {
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
      console.log("Fetching activity", activities[i].id);
      fs.writeFileSync(
        `${__dirname}/../data-prep/activities/streamed/${activities[i].id}.json`,
        JSON.stringify(activity)
      );
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
