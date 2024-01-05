const fs = require("fs");

// Read the original JSON file
fs.readFile(
  `${__dirname}/../data-prep/10379242967.json`,
  "utf8",
  (err, data) => {
    console.log("loading data");
    if (err) {
      console.error("An error occurred:", err);
      return;
    }

    const originalData = JSON.parse(data);
    console.log(originalData.length);
  }
);
