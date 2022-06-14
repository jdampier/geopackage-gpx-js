const tj = require("@tmcw/togeojson");
const fs = require("fs");
const readline = require('readline');
const sax = require("sax"),
  strict = false, // set to false for html-mode
  parser = sax.parser(strict);
  

const filePath = 'files/Washington_and_Old_Dominion_trail.gpx'
const saxStreamFUCKOFF = sax.createStream(false, {
  lowercase: true
})



/*const fileStream = fs.createReadStream(filePath)
saxStream.on('error', (e) => {
  console.error(e)
  fileStream.close()
})
saxStream.on('end', () => {
  fileStream.close()
})
fileStream.pipe(saxStream)


// keep track of current tag
let currentTag = null
let tag_name = null


    // when the tag is first encountered
    saxStream.on('opentag', (tag) => {
      currentTag = tag;
      switch (tag.name) {
        case 'tag_name':
          // tag may have some attributes... tag.attributes
          // create this tag's object
          tag_name = {}
          return
        default:
          // ignore unsupported tags
          return
      }
    })

    saxStream.on('text', (data) => {
      if (!data.trim() || !currentTag) return
      switch (currentTag.name) {
        case 'tag_name':
          // this tag has text information
          tag_name.text = data
          return
        default:
          // ignore unsupported tags
          return
      }
    })

    saxStream.on('closetag', (tag) => {
      // done with this tag
      currentTag = null
      switch (tag) {
        case 'tag_name':
          // tag name is now finished, do something with the tag_name object you created
          console.log(tag_name)
          tag_name = null
          return
        default:
          // ignore unsupported tags
          return
      }
    })
// node doesn't have xml parsing or a dom. use xmldom
const DOMParser = require("xmldom").DOMParser;

const gpx = new DOMParser().parseFromString(fs.readFileSync(filePath, "utf8"));

const converted = tj.gpx(gpx);
const json = JSON.stringify(converted);

fs.writeFile('files/test.json', json, err => {
    if (err) {
      console.error(err);
    }
    else {
      console.log("File conversion complete")
    }
  });*/

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


parser.onerror = function (e) {
  // an error happened.
};
parser.ontext = function (t) {
  // got some text.  t is the string of text.
};
parser.onopentag = function (node) {
  // opened a tag.  node has "name" and "attributes"
};
parser.onattribute = function (attr) {
  // an attribute.  attr has "name" and "value"
};
parser.onend = function () {
  // parser stream is done, and ready to have more stuff written to it.
};
 


const toBeJSON = null;
/*
var type = "FeatureCollection";
var type2 = "Feature";
var _gpxType = "trk";
var name = filePath.substring(filePath.lastIndexOf("/"), lastIndexOf("."));
    name = name.trim();
    name = name.replace('_', ' ');
var type3 = "LineString";
*/



 var begginningOfJOSN = "{\"type\":\"FeatureCollection\",\"features\":[{\"type\":\"Feature\",\"properties\":{\"_gpxType\":\"trk\",\"name\":\"Washington and Old Dominion trail\",\"coordinateProperties\":{}},\"geometry\":{\"type\":\"LineString\",\"coordinates\":["

 var coordinates = [];

 


 var saxStream = require("sax").createStream(strict, {trim:true})
 saxStream.on("error", function (e) {
   // unhandled errors will throw, since this is a proper node
   // event emitter.
   console.error("error!", e)
   // clear the error
   this._parser.error = null
   this._parser.resume()
})

fs.createReadStream(filePath) 
.pipe(saxStream)
.pipe(fs.createWriteStream("files/file-copy.xml"))

let writer = fs.createWriteStream("files/testSTREAM.json");
writer.write(begginningOfJOSN);

var holderLat = null;
var holderLong = null;
var holderEle = null;
saxStream.on("opentag", function (node) {
  if (node.name.toString() == "TRKPT") {
    holderLat = node.attributes.LAT;
    holderLong = node.attributes.LON;
  }
  // else if (node.name.toString() == "ELE") {

  // }
})
var firstRun = null;
saxStream.on("text", function (node) {
  if (this._parser.tag.name == "ELE") {
    if (firstRun != true) {
      holderEle = node; 
      writer.write("[" + holderLong + "," + holderLat + "," + holderEle + "]");
      firstRun = true
    }
    else if (firstRun == true) {
      holderEle = node; 
      writer.write(",[" + holderLong + "," + holderLat + "," + holderEle + "]");
    }
  }
})

saxStream.on("end", function(node) {
  writer.write("]}}]}")
})

