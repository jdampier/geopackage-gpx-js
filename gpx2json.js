const tj = require("@tmcw/togeojson");
const fs = require("fs");
// node doesn't have xml parsing or a dom. use xmldom
const DOMParser = require("xmldom").DOMParser;

const gpx = new DOMParser().parseFromString(fs.readFileSync("files/Washington_and_Old_Dominion_trail.gpx", "utf8"));

const converted = tj.gpx(gpx);
const json = JSON.stringify(converted);

fs.writeFile('files/test.json', json, err => {
    if (err) {
      console.error(err);
    }
    else {
      console.log("File conversion complete")
    }
  });