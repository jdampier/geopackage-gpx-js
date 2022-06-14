const fs = require("fs");
const sax = require("sax");
const strict = true;

const filePath = 'files/Washington_and_Old_Dominion_trail.gpx'

const featureCollectionStart = "{\"type\":\"FeatureCollection\",\"features\":["
const featureCollectionEnd = "]}"

// output json file
let writer = fs.createWriteStream("files/testSTREAM.json");

var saxStream = sax.createStream(strict, {trim: true, lowercase: true})
saxStream.on("error", function (e) {
   // unhandled errors will throw, since this is a proper node
   // event emitter.
   console.error("error!", e)
   // clear the error
   this._parser.error = null
   this._parser.resume()
})

let featuresWritten = 0;

let wpt = null; // Point feature

let rte = null; // LineString feature
let rtePt = null; // Point in the line string

let trk = null; // MultiLineString feature
let trkSg = null; // LineString in the MultiLineString
let trkPt = null; // Point in the LineString

function startFeature (type) {
  if (featuresWritten > 0) {
    writer.write(',')
  }
  writer.write('{\"type\": \"Feature\", \"geometry\": {\"type\":\"' + type + "\", \"coordinates\":[")
  featuresWritten++
}

saxStream.on("opentag", (node) => {
  const tag = node.name.toString().toLowerCase()
  if (tag === 'gpx') {
    writer.write(featureCollectionStart);
  } else if (tag === 'wpt') {
    wpt = {
      properties: {},
    }
  } else if (tag === 'rte') {
    rte = {
      properties: {},
      rtePointsWritten: 0
    }
  } else if (tag === 'trk') {
    trk = {
      properties: {},
      trackSegmentsWritten: 0
    }
    startFeature('MultiLineString')
  } else if (tag === 'trkseg') {
    trkSg = {
      trackPointsWritten: 0
    }
    if (trk.trackSegmentsWritten > 0) {
      writer.write(',')
    }
    writer.write('[')
  } else if (tag === 'wpt') {
    wpt = {
      lat: node.attributes.lat,
      lon: node.attributes.lon
    }
  } else if (tag === 'rtept') {
    rtePt = {
      lat: node.attributes.lat,
      lon: node.attributes.lon
    }
  } else if (tag === 'trkpt') {
    trkPt = {
      lat: node.attributes.lat,
      lon: node.attributes.lon
    }
  }
})

saxStream.on("text", function (node) {
  const currentTag = this._parser.tag.name.toLowerCase()
  if (currentTag === 'name') {
    if (trk != null) {
      trk.properties.name = node
    }
  } else if (currentTag === 'ele') {
    if (trkPt != null) {
      trkPt.elevation = node
    }
  }
})

saxStream.on('closetag', function (node) {
  const tag = node.toLowerCase()
  if (tag === 'gpx') {
    writer.write(featureCollectionEnd);
  } else if (tag === 'wpt') {
    wpt = null
  } else if (tag === 'rte') {
    rte = null
  } else if (tag === 'rtept') {
    rtePt = null
  } else if (tag === 'trk') {
    writer.write(']}, \"properties\": ' + JSON.stringify(trk.properties) + '}'); // end the multi line string
    trk = null
  } else if (tag === 'trkseg') {
    writer.write(']'); // end line string in the multi line string
    trk.trackSegmentsWritten++
    trkSg = null
  } else if (tag === 'trkpt') {
    const commaText = trkSg.trackPointsWritten > 0 ? ',' : ''
    if (trkPt.elevation != null) {
      writer.write(commaText + '[' + trkPt.lon + ',' + trkPt.lat + ',' + trkPt.elevation + ']');
    } else {
      writer.write(commaText + '[' + trkPt.lon + ',' + trkPt.lat + ']');
    }
    trkSg.trackPointsWritten++
    trkPt = null
  }
})

// read in file and pipe to sax stream
fs.createReadStream(filePath).pipe(saxStream)

