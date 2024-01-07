const dotenv = require("dotenv");
const getCredentials = require("./auth");
const getActivities = require("./activities");
dotenv.config();
dotenv.config({ path: `.env.local`, override: true });

const strava = require("strava-v3");

async function main() {
  try {
    console.log(
      "Current Strava rate limit (0-1, 1=exceeded)",
      strava.rateLimiting.fractionReached()
    );
    const creds = await getCredentials();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
  try {
    const activities = await getActivities();
    console.log(
      "The most recent activity was",
      activities[0].name,
      "on",
      activities[0].start_date,
      "with ID",
      activities[0].id
    );
    console.log(
      "Current Strava rate limit (0-1, 1=exceeded)",
      strava.rateLimiting.fractionReached()
    );
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}
main();
