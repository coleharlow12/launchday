'use strict';

// Global variables
let currentLatitude;
let currentLongitude;
let map;
let markers = [];

window.onload = function() {}

function error(error) {
  alert("Unable to retrieve your location due to " + error.code + " : " + error.message);
};

function generateGoogleMap(position) {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: position.coords.latitude, lng: position.coords.longitude},
    zoom: 15
  });

  let marker = new google.maps.Marker({
    position: {lat: position.coords.latitude, lng: position.coords.longitude},
    map: map,
    title: 'Me'
  });
  markers.push(marker);
  let geocoder = new google.maps.Geocoder;
  let infowindow = new google.maps.InfoWindow;
  geocoder.geocode({'location': {lat: position.coords.latitude, lng: position.coords.longitude}}, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      if (results[1]) {
        infowindow.setContent(results[1].formatted_address);
        infowindow.open(map, marker);
      } else {
        window.alert('No results found');
      }
    } else {
      window.alert('Geocoder failed due to: ' + status);
    }
  });

  let showBalloon = getBalloonLocation();
};

function getBalloonLocation() {
  $.get('/api/location', function(data, status) {
    generateMarker(data);
  });
}

function generateMarker(coordinates) {
  let geocoder = new google.maps.Geocoder;
  let infowindow = new google.maps.InfoWindow;
  geocoder.geocode({'location': {lat: coordinates.latitude, lng: coordinates.longitude}}, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      infowindow.setContent(results[0].formatted_address);
    }
  });
  let balloon = new google.maps.Marker({
    position: {lat: coordinates.latitude, lng: coordinates.longitude},
    map: map,
    title: 'Balloon'
  });
  infowindow.open(map, balloon);
  markers.push(balloon);
  expandMap();
}

function expandMap() {
  let bounds = new google.maps.LatLngBounds();
  for (var i = 0; i < markers.length; i++) {
    bounds.extend(markers[i].getPosition());
  }
  map.fitBounds(bounds);
}

function geoFindMe() {
  let geo_options = {
    enableHighAccuracy: true,
    maximumAge : 30000,
    timeout : 27000
  }
  navigator.geolocation.getCurrentPosition(generateGoogleMap, error, geo_options);
};

let position = geoFindMe();
// let balloon = getBalloonLocation();
generateGoogleMap(position);
// getBalloonLocation();
