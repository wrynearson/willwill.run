# Will will run

This is a React application that fetches and visualizes runs from Strava.

<img width="1818" alt="willwillrun" src="https://github.com/user-attachments/assets/9a79c57f-5de2-4931-9b75-32bdc0d5f107">

Activities of type `Run` (which include normal runs and trail runs) are fetched daily from Strava. When a listed run is selected, it is displayed on the map, along with basic information including:

- Run name
- Distance
- Pace
- Run type (normal or trail)
- Elevation gain

## Installation and Usage

1. Fork this repo
2. Install dependencies
    - If you use [`nvm`](https://github.com/creationix/nvm), activate the desired Node version: `nvm install`.
    - Install Node modules with `npm install`
3. Follow Strava's [Getting Started guide](https://developers.strava.com/docs/getting-started/) to request an API application, and follow the authentication steps to get `client_id`, `client_secret`, `refresh_token`, and so on
    - For local deployment, save these as `REACT_APP_CLIENT_ID`, `REACT_APP_CLIENT_SECRET`, `REACT_APP_AUTH_CODE` in the .env file in the root of the repo. **Do not commit this file publicly**.
    - For GitHub Pages deployment, save these as `REACT_APP_CLIENT_ID`, `REACT_APP_CLIENT_SECRET`, `REACT_APP_AUTH_CODE` as repository secrets in repo settings.
4. Start the app with `npm start`


---

_Note: The MIT license applies to the code in this repository. Usage of Strava's API may have other licensing restrictions._
