const strava = require("strava-v3");

const fs = require("fs");

const credentials = require(`${__dirname}/../credentials.json`);

strava.config({
  access_token: credentials.access_token,
  client_id: credentials.client_id,
  client_secret: credentials.client_secret,
  redirect_uri: "https://www.strava.com/oauth/authorize",
});

async function getActivities() {
  try {
    const stats = await strava.athletes.stats({
      access_token: credentials.access_token,
      id: credentials.athlete.id,
    });
    console.log(
      "Cumulative running distance: ",
      stats.all_run_totals.distance / 1000,
      "km"
    );

    fs.writeFileSync(
      `${__dirname}/../data-prep/stats.json`,
      JSON.stringify(stats)
    );
  } catch (error) {
    console.log(error);
  }
  try {
    const activities = await strava.athlete.listActivities({
      access_token: credentials.access_token,
      id: credentials.athlete.id,
    });
    console.log(activities);
  } catch (error) {
    console.log(error);
  }
}

getActivities();
