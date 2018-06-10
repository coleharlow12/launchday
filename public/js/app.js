'use strict';

// Global variables
let currentLatitude;
let currentLongitude;
let map;
let balloonPath;
let markers = [];
let locationsArray = [];
let locating = false;
let trackingActive;
let currentBalloonCoordinates;

// Wrap functions in jQuery document ready function
$(document).ready(function() {
  function geoFindMe() {
    // Get current location via browser geolocation API
    let geo_options = {
      enableHighAccuracy: true,
      maximumAge : 30000,
      timeout : 27000
    }
    navigator.geolocation.getCurrentPosition(generateGoogleMap, error, geo_options);
  };

  function error(error) {
    // Error function if browser geolocation fails
    alert("Unable to retrieve your location due to " + error.code + " : " + error.message);
  };

  function generateGoogleMap(position) {
    // Generate Google Map
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: position.coords.latitude, lng: position.coords.longitude},
      zoom: 15
    });

    // Current current location marker
    // let marker = new google.maps.Marker({
    //   position: {lat: position.coords.latitude, lng: position.coords.longitude},
    //   map: map,
    //   title: 'Me'
    // });
    // // Push marker into markers array
    // markers.push(marker);

    // Load Google geocoder and infowindow for detailed marker labels
    let geocoder = new google.maps.Geocoder;
    let infowindow = new google.maps.InfoWindow;

    // Use geocoder to change coordinates to address and plot
    geocoder.geocode({'location': {lat: position.coords.latitude, lng: position.coords.longitude}}, function(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          // Geocoder returns array of addresses ranging from specific to general
          infowindow.setContent(results[0].formatted_address);
          infowindow.open(map, marker);
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
    });
  };

  $('#start-stop').click(function() {
    // On button click...
    // Locating originally set to 'false', set to opposite value
    locating = !locating;
    if (locating) {
      // If 'locating' is true, call trackBalloon function
      trackBalloon();
    } else {
      // If 'locating' is false clear the interval responsible for getting balloon location
      clearInterval(trackingActive);
    }
  });

  function trackBalloon() {
    // Call getBalloonLocation immediately when called, then every X seconds
    getBalloonLocation();
    // setInterval function will repeatedly call getBalloonLocation at the defined interval
    // 5000 is 5 seconds; increase or lower as desired
    trackingActive = setInterval(function() {
      getBalloonLocation();
    }, 5000);
    return trackingActive;
  }

  function getBalloonLocation() {
    // Make API call to location endpoint to return coordinates (lng, lat, alt)
    $.get('/api/location', function(data, status) {
      if (JSON.stringify(currentBalloonCoordinates) !== JSON.stringify(data)) {
        // If newly retrieved coordinates do NOT match previous coordinates, update map and button
        // generateMarker(data);
        generatePath(data);
        updateButton(data);
        // Set balloon coordinates to equal new location data
        currentBalloonCoordinates = data;
      }
    });
  }

  function generateMarker(coordinates) {
    // Generate marker and get address for marker label
    // let geocoder = new google.maps.Geocoder;
    // let infowindow = new google.maps.InfoWindow;
    // geocoder.geocode({'location': {lat: coordinates.latitude, lng: coordinates.longitude}}, function(results, status) {
    //   if (status === google.maps.GeocoderStatus.OK) {
    //     infowindow.setContent(results[0].formatted_address);
    //   }
    // });
    let balloon = new google.maps.Marker({
      // New marker titled 'Balloon'
      position: {lat: coordinates.latitude, lng: coordinates.longitude},
      map: map,
      title: 'Balloon'
    });
    // Add new marker and label to map
    // infowindow.open(map, balloon);
    // Push new marker into markers array
    markers.push(balloon);
    expandMap();
  }

  function generatePath(coordinates) {
    let googleCoordinates = new google.maps.LatLng(coordinates.latitude, coordinates.longitude);
    locationsArray.push(googleCoordinates);
    let balloonPath = new google.maps.Polyline({
      path: locationsArray,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2
    });
    balloonPath.setMap(map);
    expandMap();
  }

  function expandMap() {
    // Get coordinates of all markers and expand map to display all
    let bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < locationsArray.length; i++) {
      // bounds.extend(markers[i].getPosition());
      bounds.extend(locationsArray[i]);
    }
    // Google function to resize map based on markers present
    map.fitBounds(bounds);
  }

  function updateLocationText(coordinates) {

  }

  function updateButton(coordinates) {
    let $button = $('#location-button');
    let geocoder = new google.maps.Geocoder;
    geocoder.geocode({'location': {lat: coordinates.latitude, lng: coordinates.longitude}}, function(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        $button.html('<p>' + results[0].formatted_address + '</p>');
      }
    });
    // Update the URL of the "Location Button" to link to the most recently returned coordinates
    let coordinatesString = (coordinates.latitude.toString()) + ',' + (coordinates.longitude.toString());
    let url = 'https://www.google.com/maps/search/?api=1&query=' + coordinatesString;
    // Get HTML element with ID of 'location-button' and set the 'href' attribute to equal the above URL
    $button.attr('href', url);
  }

  // Application start
  // Get current location
  let position = geoFindMe();
  // Generate initial Google Map using current location
  generateGoogleMap(position);
});
