const dotenv = require("dotenv");
const getCredentials = require("./auth");
dotenv.config();
dotenv.config({ path: `.env.local`, override: true });

async function main() {
  try {
    const creds = await getCredentials();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}
main();
