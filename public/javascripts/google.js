let map; let infoWindow; let pos;

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
  if (!pos) {
    pos = { lat: -23.5506507, lng: -46.6333824 };
  }

  map = new google.maps.Map(document.getElementById('map'), {
    // center: { lat: -23.5506507, lng: -46.6333824 },
    center: pos,
    zoom: 17,
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
    icon: 'https://res.cloudinary.com/juliaramosguedes/image/upload/v1569094277/project-vegspot/vegflag.png',
  });

  const contentString = '<h1>holy</h1>';
  const infowindow = new google.maps.InfoWindow({
    content: contentString,
  });

  marker.addListener('mouseover', () => {
    infowindow.open(map, marker);
  });

  marker.addListener('click', () => {
    console.log(infoWindow.content);
  });

  marker.addListener('mouseout', () => {
    infowindow.close();
  });
}

function addMarkerPlaces(places) {
  //deleteMarkers();
  infoWindow = new google.maps.InfoWindow();
  const bounds = new google.maps.LatLngBounds();
  let contentString = []
  let marker = []
  for (let i = 0; i < places.length; i++) {
    let place = places[i];
    let coords = place.geometry.location;
    console.log(place.name, place.formatted_address);
    contentString[i] = `
    <div>${place.name}</div>
    <div>${place.formatted_address}</div>
    <button class='botao-cadastro'>cadastre</button>
    `;
    marker[i] = new google.maps.Marker({
      position: coords,
      map,
      icon: 'https://res.cloudinary.com/juliaramosguedes/image/upload/v1569094277/project-vegspot/vegflag.png',
    });

    marker[i].addListener('mouseover', () => {
      infoWindow.setContent(contentString[i]);
      infoWindow.open(map, marker[i]);
    });

    marker[i].addListener('click', () => {
      console.log(place);
    });

    marker[i].addListener('mouseout', () => {
      infoWindow.close();
    });
    bounds.extend(places[i].geometry.location);
  }
  map.fitBounds(bounds);
  console.log(marker.length)

  function deleteMarkers(){
    if(typeof(marker)){
      console.log('entrei')
      for(let i = 0; i < marker.length; i++){
        marker[i] = setMap(null)
      }
    }
  }
}



function geocode(location) {
  axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
    params: {
      address: location,
      key: 'AIzaSyBMHh2PAjIzu_M-qkzRXzMGqMzjMxLAuMY',
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
      placeDetails(placeId);
    })
    .catch((error) => {
      console.log(error);
    });
}

function findPlaces(text) {
  const request = {
    location: pos,
    radius: '500',
    query: text,
    //bounds: 'strictbounds',
    //type: ['restaurant'],
  };
  console.log('request location', request.location)
  service = new google.maps.places.PlacesService(map);
  service.textSearch(request, callback);

  function callback(places, status) {
    console.log('places', places);
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      addMarkerPlaces(places);
    }
  }
}



function placeDetails(id) {
  const request = {
    placeId: id,
    // fields: ['name', 'rating', 'formatted_phone_number', 'geometry'],
  };

  service = new google.maps.places.PlacesService(map);
  service.getDetails(request, callback);

  function callback(place, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      console.log(place);
    }
  }
}


document.getElementById('button').onclick = function (event) {
  event.preventDefault();
  document.getElementById('formatted-address').innerHTML = '';
  const address = document.getElementById('address').value;
  console.log('address', address);
  findPlaces(address);
  geocode(address);
  document.getElementById('address').value = '';
};
