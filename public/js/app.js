'use strict';
let currentLatitude;
let currentLongitude;

window.onload = function() {}

function error(error) {
  alert("Unable to retrieve your location due to " + error.code + " : " + error.message);
};

function generateGoogleMap(position) {
  let map;
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: position.coords.latitude, lng: position.coords.longitude},
    zoom: 15
  });

  let marker = new google.maps.Marker({
    position: {lat: position.coords.latitude, lng: position.coords.longitude},
    map: map
    // animation: google.maps.Animation.DROP
  });
  // let marker = dropPin(map, {lat: position.coords.latitude, lng: position.coords.longitude});
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
};

function getBalloonLocation() {
  
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
generateGoogleMap(position);
