const dotenv = require("dotenv");
const getCredentials = require("./auth");
const getActivities = require("./activities");
dotenv.config();
dotenv.config({ path: `.env.local`, override: true });

async function main() {
  try {
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
      activities[0].start_date
    );
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}
main();
