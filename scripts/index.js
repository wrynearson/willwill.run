const dotenv = require("dotenv");
const fs = require("fs-extra");

const getActivities = require("./activities");
const streamActivity = require("./activity");

dotenv.config();
dotenv.config({ path: `.env.local`, override: true });

const strava = require("strava-v3");

async function main() {
  await fs.ensureDir(`${__dirname}/../data-prep`);

  try {
    console.log(
      "Current Strava rate limit (0-1, 1=exceeded)",
      strava.rateLimiting.fractionReached()
    );

    console.log("\nRunning getActivities()");
    const activities =
      process.argv[2] === "--no-fetch"
        ? await fs.readJSON(`${__dirname}/../data-prep/activities.json`)
        : await getActivities();

    console.log(
      "The most recent activity was",
      activities[0].name,
      "on",
      activities[0].start_date,
      "with ID",
      activities[0].id
    );

    console.log("\nRunning streamActivity()");
    await streamActivity(activities);
    console.log(
      "Streamed all found activities from Strava that weren't already present in the streamed folder."
    );
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}
main();
