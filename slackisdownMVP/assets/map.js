// Initiate the map function
var map;
var geocoder;
var markers;
var infowindow;

// var latlng = marker.getPosition();
// var lat = latlng.lat();
// var long = latlng.lng();

function initMap() {

  var initialLocation;

  geocoder = new google.maps.Geocoder;

  markers = [];

  //Variable that holds the google map 
  map = new google.maps.Map(document.getElementById('map'), {
    //This is where on the world map the page will load to 
    center: { lat: 37.4419, lng: -122.1419 },
    //This is the speciic level of zoom. 
    zoom: 13
  });

  var delay = 5000
  setTimeout(function () {
    //These are the variables that hold things relevant to the input
    var card = document.getElementById('pac-card');
    var input = document.getElementById('pac-input');
    var types = document.getElementById('type-selector');

    //This is where the information that is used at the top will be pushed to for the user to see. 
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(card);

    //This is the autocomplete variable that holds... you guessed it the autcomplete that would be based on user's input. 
    var autocomplete = new google.maps.places.Autocomplete(input);

    //Creating a bound for the autcomplete regarding the map. 
    autocomplete.bindTo('bounds', map);

    //Function that will react when the location of where the map is focusing on changes. 
    autocomplete.addListener('place_changed', function () {
      //Closes the infowindow
      infowindow.close();
      //The marker that was plaed in the previous place is now not visible for the user. 
      marker.setVisible(false);
      // Variable that holds the autocomplete places. 
      var place = autocomplete.getPlace();
      //If there is no information on the input, there will be an error. 
      if (!place.geometry) {
        return;
      }

      // If the place has a geometry, then present it on a map.
      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);
      }
      //Setting the position of the new marker, and making it visible for the user to see. 
      marker.setPosition(place.geometry.location);
      marker.setVisible(true);

      //This is the variable that holds the address; its currently blank as it will be utilized later. 
      address = '';
      if (place.address_components) {
        address = [
          (place.address_components[0] && place.address_components[0].short_name || ''),
          (place.address_components[1] && place.address_components[1].short_name || ''),
          (place.address_components[2] && place.address_components[2].short_name || '')
        ].join(' ');
      }
      //appending children with these properties such as source and text content
      infowindowContent.children['place-icon'].src = place.icon;
      infowindowContent.children['place-name'].textContent = place.name;
      infowindowContent.children['place-address'].textContent = address;
      infowindow.open(map, marker);
    });
  }, delay)

  // The variable that holds the infowindow which is basically a popwindow above the map. 
  infowindow = new google.maps.InfoWindow({
    content: document.getElementById('form')
  });

  var messagewindow = new google.maps.InfoWindow({
    content: document.getElementById('message')
  });

  google.maps.event.addListener(map, 'click', function (event) {
    marker = new google.maps.Marker({
      position: event.latLng,
      map: map
    });
  });

  // document.getElementById('submit').addEventListener('click', function () {
  //   var valueOfTable = document.getElementById('latlng.value');
  //   var savingValuableTable = document.getElementById('tableSave');
  //   map.setCenter(valueOfTable);
  //   geocodeLatLng(geocoder, map, infowindow);
  //   infowindow.setContent(savingValuableTable);

  // });

  var infowindowContent = document.getElementById('infowindow-content');
  infowindow.setContent(infowindowContent);

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      infowindow.setPosition(pos);
      marker = new google.maps.Marker({
        position: pos,
        map: map
      })
      infowindow.setContent(tableSave);
      infowindow.open(map);
      map.setCenter(pos);

      // navigator.geolocation.getCurrentPosition(function(position){
      //   map.setZoom(17);
      //   marker = new google.maps.Marker({
      //     position: pos,
      //     map: map
      //   })
      // })

    }, function () {
      handleLocationError(true, infowindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infowindow, map.getCenter());
  }

  function handleLocationError(browserHasGeolocation, infowindow, pos) {
    infowindow.setPosition(pos);
    infowindow.open(map);
  }
  function lat() {

  }

  // I tried to make a feature that would save your data after inputting some data, and these variables would save those strings. 
  var delay = 5000;
  setTimeout(function () {
    $('#saveButton').on('click', function () {
      var name = escape(document.getElementById('name').value);
      for (var i = 0; i < name.length; i++) {
        name = name.replace('%20', ' ');
      }
      for (var i = 0; i < name.length; i++) {
        name = name.replace(/%2C/g, ",");
      }
      console.log(name);
      var address = escape(document.getElementById('address').value);
      for (var i = 0; i < address.length; i++) {
        address = address.replace('%20', ' ');
      }
      console.log(address);
      // var type = document.getElementById('typeSelect'); //We need to fix this
      // console.log(type);
      var latlng = marker.getPosition();
      var url = 'phpsqlinfo_addrow.php?name=' + name + '&address=' + address + '&lat=' + latlng.lat() + '&lng=' + latlng.lng();

      //Checking to see if this would give us our latitude and longitude. 
      console.log(latlng.lat());
      console.log(latlng.lng());

      //The downloadURL is vital as it responds to what happens when there is something in the textbox. THis is why I didn't simply comment out the entire savaData function. 
      downloadUrl(url, function (data, responseCode) {

        if (responseCode == 200 && data.length <= 1) {
          infowindow.close();
          messagewindow.open(map, marker);
        }
      });
    });
  }, delay);

  // function saveData() {
  //   console.log(name);
  //   console.log("Hello World");

  // }

  //Marker variable that will hold the marker ability that Google Maps has. 
  marker = new google.maps.Marker({
    //The marker will be based on the map. 
    map: map,
    //This is where the marker point will be at. 
    anchorPoint: new google.maps.Point(0, -29)
  });

  // Sets a listener on a button to change the filter type on Places
  // Autocomplete.
  function setupClickListener(id, types) {
    var Button = document.getElementById(id);
    Button.addEventListener('click', function () {
      autocomplete.setTypes(types);
    });
  }

  setupClickListener('changetype-all', []);
  setupClickListener('changetype-address', ['address']);
  setupClickListener('changetype-establishment', ['establishment']);
  // setupClickListener('changetype-LatLng', ['latitude', 'longitude']);

  google.maps.event.addListener(map, 'click', function (event) {
    placeMarker(event.latLng);
  });

  google.maps.event.addListener(marker, 'click', function () {
    infowindow.open(map, marker);
  });
}
function setMapOnAll(maps) {
  for (var i = 0; i < marker.length; i++) {
    marker[i].setMap(maps);
  }
}
function clearMarkers() {
  setMapOnAll(null);
}
function downloadUrl(url, callback) {
  var request = window.ActiveXObject ?
    new ActiveXObject('Microsoft.XMLHTTP') :
    new XMLHttpRequest;

  request.onreadystatechange = function () {
    if (request.readyState == 4) {
      request.onreadystatechange = doNothing;
      callback(request.responseText, request.status);
    }
  };

  request.open('GET', url, true);
  // request.send(null);
}

//This function is self-explanatory... 
function doNothing() {
}

//This will place a marker at the specified location. 
function placeMarker(location) {
  marker = new google.maps.Marker({
    position: location,
    map: map
  });

}
function geocodeLatLng(geocoder, map, infowindow) {
  var input = document.getElementById('latlng').value;
  var latlngStr = input.split(',', 2);
  var latlng = { lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1]) };
  geocoder.geocode({ 'location': latlng }, function (results, status) {
    if (status === 'OK') {
      if (results[0]) {
        map.setZoom(17);
        marker = new google.maps.Marker({
          position: latlng,
          map: map
        });

        infowindow.setContent(results[0].formatted_address);
        infowindow.open(map, marker);
      } else {
        window.alert('No results found');
      }
    } else {
      window.alert('Geocoder failed due to: ' + status);
    }
  });
}