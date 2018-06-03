'use strict';
const fs    = require('fs');

function getLocation(req, res) {
  console.log('GET Location');
  fs.readFile('./python/currentLocation.kml', 'utf8', (err, data) => {
    let coordinatesArray = data.toString().split('<coordinates>')[1].split('</coordinates>')[0].trim().split(',').map(Number);
    let coordinatesObject = {
  		'longitude' : coordinatesArray[0],
  		'latitude' : coordinatesArray[1],
  		'altitude' : coordinatesArray[2]
  	}
    res.json(coordinatesObject);
  });
}

module.exports = {
  getLocation: getLocation
}
