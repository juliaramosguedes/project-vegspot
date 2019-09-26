<<<<<<< HEAD
// let map;
// let infoWindow;
let pos;
=======
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
>>>>>>> 3ae66a0bb63ea85b350e6a32b0eaeadfff0a7fed

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 15,
  });
  infoWindow = new google.maps.InfoWindow();

  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      infoWindow.setPosition(pos);
      infoWindow.setContent('Location found.');
      infoWindow.open(map);
      map.setCenter(pos);
    }, () => {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
}

function addSingleMarker(coords) {
  icon = 'https://res.cloudinary.com/juliaramosguedes/image/upload/v1569094277/project-vegspot/vegflag.png';
  const marker = new google.maps.Marker({
    position: coords,
    map,
<<<<<<< HEAD
    icon,
=======
    icon: 'https://res.cloudinary.com/juliaramosguedes/image/upload/v1569094277/project-vegspot/vegflag.png',
>>>>>>> 3ae66a0bb63ea85b350e6a32b0eaeadfff0a7fed
  });

  const contentString = `
  <h2>X marks the spot</h2>

  `;

  /* const contentString = `
  <h2>${name}</h2>
  <h2>${address}</h2>
  <h2>${rating}</h2>
  `; */
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

 function addMarker(spot) {
  infoWindow = new google.maps.InfoWindow();
  const bounds = new google.maps.LatLngBounds();
  let contentString = [];
  let marker = [];
  for (let i = 0; i < places.length; i++) {
    let place = spot[i];
    const title = spot.children[1].children[0].innerText;
    const vegCategory = spot.children[1].children[1].innerText;
    const address = spot.children[1].children[2].innerText;
    const coords = spot.children[1].children[4].innerText;
    contentString[i] = `
    <div class = 'marker-title'>${title}</div>
    <div class = 'marker-category'>${vegCategory}</div>
    <div class = 'marker-address'>${address}</div>
    `;
    marker[i] = new google.maps.Marker({
      position: coords,
      map,
      icon:
        'https://res.cloudinary.com/juliaramosguedes/image/upload/v1569094277/project-vegspot/vegflag.png'
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
} 

function addMarkerPlaces(places) {
  const infoWindow = new google.maps.InfoWindow();
  const bounds = new google.maps.LatLngBounds();
  const contentString = [];
  const marker = [];
  for (let i = 0; i < places.length; i++) {
    const place = places[i];
    const coords = place.geometry.location;
    console.log(place.name, place.formatted_address);
    contentString[i] = `
    <div>${place.name}</div>
    <div>${place.formatted_address}</div>
    <button class='botao-cadastro'>cadastre</button>
    `;
    marker[i] = new google.maps.Marker({
      position: coords,
      map,
<<<<<<< HEAD
      icon:
        'https://res.cloudinary.com/juliaramosguedes/image/upload/v1569094277/project-vegspot/vegflag.png',
=======
      icon: 'https://res.cloudinary.com/juliaramosguedes/image/upload/v1569094277/project-vegspot/vegflag.png',
>>>>>>> 3ae66a0bb63ea85b350e6a32b0eaeadfff0a7fed
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
}

// function deleteMarkers() {
//   if (typeof marker) {
//     console.log('entrei');
//     for (let i = 0; i < marker.length; i++) {
//       marker[i] = setMap(null);
//     }
//   }
// }
async function geocode(location) {
  try {
    return await axios
      .get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          address: location,
          key: 'AIzaSyCmsgN1sAoxmCU5VgToMMNPMrWooHKqNJo',
        },
      });
  } catch (error) {
    console.log(error);
  }
}

<<<<<<< HEAD
async function findPlaces(text) {
  try {
    const request = {
      location: pos,
      radius: '500',
      query: text,
      // bounds: 'strictbounds',
      // type: ['restaurant'],
    };
    const service = new google.maps.places.PlacesService(map);
    console.log('mapservice')
    await service.textSearch(request, async (places, status) => {
      try {
        console.log('find places', places);
        return await places;
                if (status == google.maps.places.PlacesServiceStatus.OK) {
          return await places;
        }
      } catch (error) {
        console.log(error);
      }
=======


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
>>>>>>> 3ae66a0bb63ea85b350e6a32b0eaeadfff0a7fed
    });
  } catch (error) {
    console.log(error);
  }
}

/* async function findPlaces(text) {
  const request = {
    location: pos,
    radius: '500',
    query: text,
    // bounds: 'strictbounds',
    // type: ['restaurant'],
  };
  console.log('request location', request.location);
  service = new google.maps.places.PlacesService(map);
  service.textSearch(request, callback);

  function callback(places, status) {
    console.log('find places', places);
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      addMarkerPlaces(places);
    }
  }
} */

function placeDetails(id) {
  const request = {
    placeId: id,
    // fields: ['name', 'rating', 'formatted_phone_number', 'geometry'],
  };

  service = new google.maps.places.PlacesService(map);
  service.getDetails(request, callback);

  function callback(place, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      console.log('place details', place);
    }
  }
}

// document.getElementById('button').onclick = function(event) {
//   event.preventDefault();
//   document.getElementById('formatted-address').innerHTML = '';
//   const address = document.getElementById('address').value;
//   console.log('address', address);
//   findPlaces(address);
//   geocode(address);
//   document.getElementById('address').value = '';
//   const input = document.getElementById('address');
//   const autocomplete = new google.maps.places.Autocomplete(input);
// };
