const strava = require("strava-v3");

const fs = require("fs");

const credentials = require(`${__dirname}/../credentials.json`);

// strava.config({
//   access_token: credentials.access_token,
//   client_id: credentials.client_id,
//   client_secret: credentials.client_secret,
//   redirect_uri: "https://www.strava.com/oauth/authorize",
// });

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
      per_page: 200,
    });
    //console.log(activities);

    fs.writeFileSync(
      `${__dirname}/../data-prep/activities.json`,
      JSON.stringify(activities)
    );

    // temporarily hardcode individual activity ID

    const activity = await strava.streams.activity({
      access_token: credentials.access_token,
      id: 10379242967,
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

    console.log(activity);

    fs.writeFileSync(
      `${__dirname}/../data-prep/10379242967.json`,
      JSON.stringify(activity)
    );
  } catch (error) {
    console.log(error);
  }
}

getActivities();
