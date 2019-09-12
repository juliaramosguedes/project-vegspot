let map; let infoWindow; let
  pos;

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition((position) => {
    pos = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };
  }, () => {
    handleLocationError(true, infoWindow, map.getCenter());
  });
} else {
  // Browser doesn't support Geolocation
  handleLocationError(false, infoWindow, map.getCenter());
}

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    // center: { lat: -23.5506507, lng: -46.6333824 },
    center: pos,
    zoom: 12,
  });

  infoWindow = new google.maps.InfoWindow();
  infoWindow.setPosition(pos);
  infoWindow.setContent('Voce esta aqui.');
  infoWindow.open(map);
  map.setCenter(pos);
  addMarker(pos);

  input = document.getElementById('address');
  const autocomplete = new google.maps.places.Autocomplete(input);
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation
    ? 'Error: The Geolocation service failed.'
    : 'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}

function addMarker(coords) {
  const marker = new google.maps.Marker({
    position: coords,
    map,
    icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
  });

  const contentString = '<h1>holy</h1>';
  const infowindow = new google.maps.InfoWindow({
    content: contentString,
  });

  marker.addListener('click', () => {
    infowindow.open(map, marker);
  });
}

function geocode(location) {
  axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
    params: {
      address: location,
      key: 'AIzaSyAFJywZr8chFDtxNX5tPazJiwOvUr6pQCQ',
    },
  })
    .then((response) => {
      console.log('response', response);

      const coord = response.data.results[0].geometry.location;
      const formattedAddress = response.data.results[0].formatted_address;
      const placeId = response.data.results[0].place_id;
      document.getElementById('formatted-address').innerHTML += `${formattedAddress}`;
      addMarker(coord);
      console.log('geocode', coord, formattedAddress, placeId);
    })
    .catch((error) => {
      console.log(error);
    });
}
placeDetails();

// function placeDetails() {
//   axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
//     params: {
//       place_id: 'ChIJW5hIjUZZzpQRDJtd2P4nT2k',
//       key: 'AIzaSyAFJywZr8chFDtxNX5tPazJiwOvUr6pQCQ',
//     },
//   })
//     .then((detail) => {
//       console.log('detail', detail);
//     })
//     .catch((error) => {
//       console.log(error)
//     });
// }

function placeDetails() {
  axios.get('https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJW5hIjUZZzpQRDJtd2P4nT2k&key=AIzaSyAFJywZr8chFDtxNX5tPazJiwOvUr6pQCQ')
    .then((detail) => {
      console.log('detail', detail);
    });
}


document.getElementById('button').onclick = function (event) {
  event.preventDefault();
  document.getElementById('formatted-address').innerHTML = '';
  const address = document.getElementById('address').value;
  console.log('address', address);
  geocode(address);
  document.getElementById('address').value = '';
};
