const dotenv = require("dotenv");

const getActivities = require("./activities");
const streamActivity = require("./activity");
const transformActivity = require("./transform");

dotenv.config();
dotenv.config({ path: `.env.local`, override: true });

const strava = require("strava-v3");

async function main() {
  try {
    if (process.argv[2] !== "-t") {
      console.log(
        "Current Strava rate limit (0-1, 1=exceeded)",
        strava.rateLimiting.fractionReached()
      );

      console.log("\n Running getActivities()");
      const activities = await getActivities();
      console.log(
        "The most recent activity was",
        activities[0].name,
        "on",
        activities[0].start_date,
        "with ID",
        activities[0].id
      );

      console.log("\n Running streamActivity()");
      const activity = await streamActivity();
      console.log(
        "Streamed all found activities from Strava that weren't already present in the streamed folder."
      );
    }

    console.log("\n Only transforming activities in streamed folder");
    const transform = await transformActivity();
    console.log("\n Streamed activities transformation complete");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}
main();
