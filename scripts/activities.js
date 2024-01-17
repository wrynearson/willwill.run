// get an overview of all activities

const strava = require("strava-v3");

const fs = require("fs-extra");

const getCredentials = require("./auth");

// strava.config({
//   access_token: credentials.access_token,
//   client_id: credentials.client_id,
//   client_secret: credentials.client_secret,
//   redirect_uri: "https://www.strava.com/oauth/authorize",
// });

async function getActivities() {
  const credentials = await getCredentials();

  const stats = await strava.athletes.stats({
    access_token: credentials.access_token,
    id: credentials.athlete.id,
  });
  console.log(
    "Cumulative running distance: ",
    stats.all_run_totals.distance / 1000,
    "km"
  );

  await fs.writeJSON(`${__dirname}/../data-prep/stats.json`, stats);

  // handles pagination. For each pageNum, we get 200 activities, then check the next page until no activities are returned (page.length = 0)

  const fetchPage = async (pageNum) => {
    const response = await strava.athlete.listActivities({
      access_token: credentials.access_token,
      id: credentials.athlete.id,
      per_page: 200,
      page: pageNum,
    });
    return response;
  };

  let pageNum = 1;
  let pageContent = null;
  let activities = [];

  do {
    console.log(`Fetching Strava page ${pageNum}`);
    pageContent = await fetchPage(pageNum);
    activities = activities.concat(pageContent);
    pageNum += 1;
  } while (pageContent.length > 0);

  // let pageNum = 1;
  // let pageContent = await fetchPage(pageNum);
  // let activities = pageContent;

  // while (pageContent.length > 0) {
  //   pageNum += 1;
  //   console.log(`Fetching Strava page ${pageNum}`);
  //   pageContent = await fetchPage(pageNum);
  //   activities = activities.concat(pageContent);
  // }

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
}

module.exports = getActivities;
