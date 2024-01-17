// get an overview of all activities

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
    // handles pagination. For each pageNum, we get 200 activities, then check the next page until no activities are returned (page.length = 0)

    const fetchPage = async (page) => {
      const response = await strava.athlete.listActivities({
        access_token: credentials.access_token,
        id: credentials.athlete.id,
        per_page: 200,
        page: page,
      });
      return response;
    };

    let pageNum = 1;
    let page = await fetchPage(pageNum);

    let activities = page;

    while (page.length > 0) {
      pageNum += 1;
      console.log(`Fetching Strava page ${pageNum}`);
      page = await fetchPage(pageNum);
      activities = activities.concat(page);
    }

    // while (activity.length > 0) {
    //   page+= 1;

    console.log(
      "Fetching activities complete. There are a total of",
      activities.length,
      "activities."
    );

    fs.writeFileSync(
      `${__dirname}/../data-prep/activities.json`,
      JSON.stringify(activities)
    );

    return activities;
  } catch (error) {
    console.log(error);
  }
}

module.exports = getActivities;
