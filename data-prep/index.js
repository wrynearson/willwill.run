const dotenv = require('dotenv');
dotenv.config();
dotenv.config({ path: `.env.local`, override: true });

const strava = require('strava-v3');

strava.config({
  "access_token"  : process.env.STRAVA_ACCESS_TOKEN
  // "client_id"     : "Your apps Client ID (Required for oauth)",
  // "client_secret" : "Your apps Client Secret (Required for oauth)",
  // "redirect_uri"  : "Your apps Authorization Redirection URI (Required for oauth)",
});

console.log(process.env.STRAVA_ACCESS_TOKEN)

async function main() {
  const payload = await strava.athlete.listActivities({})

  console.log(payload);
}

main();
