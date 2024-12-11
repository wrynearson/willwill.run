// http://www.strava.com/oauth/authorize?client_id=[CLIENT_ID]&response_type=code&redirect_uri=http://localhost/exchange_token&approval_prompt=force&scope=read_all,activity:read_all

const fs = require("fs-extra");

async function getCredentials() {
  try {
    const credentials = require(`${__dirname}/../credentials.json`);

    if (credentials.expires_at * 1000 <= Date.now()) {
      const response = await fetch(
        `https://www.strava.com/oauth/token?client_id=${process.env.REACT_APP_CLIENT_ID}&client_secret=${process.env.REACT_APP_CLIENT_SECRET}&grant_type=refresh_token&refresh_token=${credentials.refresh_token}`,
        { method: "POST" }
      );
      const creds = await response.json();

      const newCredentials = {
        ...credentials,
        refresh_token: creds.refresh_token,
        access_token: creds.access_token,
        expires_at: creds.expires_at,
        expires_in: creds.expires_in,
      };

      fs.writeFileSync(
        `${__dirname}/../credentials.json`,
        JSON.stringify(newCredentials)
      );

      return newCredentials;
    } else {
      const min_to_expire = Math.floor(
        // ms to minutes = 1000 * 60 = 60000
        (credentials.expires_at * 1000 - Date.now()) / 60000
      );
      // console.log(`Token expires in ${min_to_expire} minutes`);
      return credentials;
    }
  } catch (error) {
    if (error.code === "MODULE_NOT_FOUND") {
      try {
        const response = await fetch(
          `https://www.strava.com/oauth/token?client_id=${process.env.REACT_APP_CLIENT_ID}&client_secret=${process.env.REACT_APP_CLIENT_SECRET}&code=${process.env.REACT_APP_AUTH_CODE}&grant_type=authorization_code`,
          { method: "POST" }
        );
        const creds = await response.json();

        if (creds.errors) {
          console.log(creds);
          throw new Error("Credentials request failed");
        }

        fs.writeFileSync(
          `${__dirname}/../credentials.json`,
          JSON.stringify(creds)
        );

        return creds;
      } catch (error) {
        console.log(error);
        throw error;
      }
    } else {
      console.log(error);
      throw error;
    }
  }
}

module.exports = getCredentials;
