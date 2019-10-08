let pos;
let markers = [];

// function initMap() {
//   map = new google.maps.Map(document.getElementById('map'), {
//     center: { lat: -34.397, lng: 150.644 },
//     zoom: 15,
//   });
//   infoWindow = new google.maps.InfoWindow();

//   // Try HTML5 geolocation.
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition((position) => {
//       pos = {
//         lat: position.coords.latitude,
//         lng: position.coords.longitude,
//       };

//       infoWindow.setPosition(pos);
//       infoWindow.setContent('Location found.');
//       infoWindow.open(map);
//       map.setCenter(pos);
//     }, () => {
//       handleLocationError(true, infoWindow, map.getCenter());
//     });
//   } else {
//     // Browser doesn't support Geolocation
//     //handleLocationError(false, infoWindow, map.getCenter());
//     pos = {
//       lat: -23.5617714,
//       lng: -46.66019,
//     };
//     map.setCenter(pos);
//   }
// }

function initMap() {
  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
    });
  } else {
    // Browser doesn't support Geolocation
    // handleLocationError(false, infoWindow, map.getCenter());
    pos = {
      lat: -23.5617714,
      lng: -46.66019,
    };
  }

  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 15,
  });
}

function markCurrentLocation() {
  const infoWindow = new google.maps.InfoWindow();
  infoWindow.setPosition(pos);
  infoWindow.setContent('Você está aqui');
  infoWindow.open(map);
  map.setCenter(pos);
}

async function addSingleMarker(coords, newLocalSearch) {
  deleteMarkers();
  if (typeof newLocalSearch !== 'undefined'){
    icon = 'https://res.cloudinary.com/juliaramosguedes/image/upload/v1569094277/project-vegspot/vegflag.png';
  } else {
    icon = 'https://res.cloudinary.com/juliaramosguedes/image/upload/v1569094277/project-vegspot/vegflag.png';
  }
  const marker = new google.maps.Marker({
    position: coords,
    map,
    icon,
  });
  map.setCenter(coords);
  markers.push(marker);
}

function addMarker(places) {
  infoWindow = new google.maps.InfoWindow();
  const bounds = new google.maps.LatLngBounds();
  const contentString = [];
  const marker = [];
  for (let i = 0; i < places.length; i++) {
    const place = places[i];

    contentString[i] = `
    <div class = 'marker-title'>${place.title}</div>
    <div class = 'marker-category'>${place.vegCategory}</div>
    <div class = 'marker-address'>${place.address}</div>
    `;
    marker[i] = new google.maps.Marker({
      position: place.coord,
      map,
      icon:
        'https://res.cloudinary.com/juliaramosguedes/image/upload/v1569094277/project-vegspot/vegflag.png',
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
    bounds.extend(places[i].coord);
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
    // console.log(place.name, place.formatted_address);
    contentString[i] = `
    <div>${place.name}</div>
    <div>${place.formatted_address}</div>
    `;
    marker[i] = new google.maps.Marker({
      position: coords,
      map,
      icon:
        'https://res.cloudinary.com/juliaramosguedes/image/upload/v1569094277/project-vegspot/vegflag.png',
    });

    marker[i].addListener('mouseover', () => {
      infoWindow.setContent(contentString[i]);
      infoWindow.open(map, marker[i]);
    });

    marker[i].addListener('click', () => {
      placeDetails(place.place_id);
    });

    marker[i].addListener('mouseout', () => {
      infoWindow.close();
    });
    bounds.extend(places[i].geometry.location);
  }
  map.fitBounds(bounds);
}

function deleteMarkers() {
  if (typeof markers !== 'undefined') {
    for (let i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    markers = [];
  }
}

async function geocode(location) {
  try {
    return await axios
      .get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          address: location,
          key: 'AIzaSyCmsgN1sAoxmCU5VgToMMNPMrWooHKqNJo',
          region: 'br',
        },
      });
  } catch (error) {
    console.log(error);
  }
}

async function findPlaces(text) {
  const request = {
    location: pos,
    radius: '500',
    query: text,
    // bounds: 'strictbounds',
    // type: ['restaurant'],
  };
  const service = new google.maps.places.PlacesService(map);
  await service.textSearch(request, (places, status) => {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      addMarkerPlaces(places);
      document.getElementById('addList').innerHTML = '';
      places.forEach((place, index) => {
        // console.log('places', place);

        document.getElementById('addList').innerHTML += `
        <li class="addPlace">${place.name} ${place.formatted_address}
        <input type="hidden" value="${index}">
        <button class="fillListButton btn btn-info">Selecionar</button>
        </li>
        `;
      });
      const addButton = document.querySelectorAll('.fillListButton');
      addButton.forEach((button, index) => {
        button.onclick = function () {
          // console.log(index);
          placeDetails(places[index].place_id);
          map.setCenter(places[index].geometry.location);
          // addSingleMarker(places[index].geometry.location);
          document.getElementById('map').scrollIntoView();
        };
      });
    }
  });
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
      console.log('place details', place);
      const coord = JSON.parse(JSON.stringify(place.geometry.location).toString());
      console.log('place coord', coord);
      let workTime = '';
      place.opening_hours.weekday_text.forEach((day) => {
        workTime += `${day.toString()}\n`;
      });
      document.getElementById('clearSelection').innerHTML = `
      <button id="clearSelectionButton" class="btn btn-info">Limpar Seleção</button>
      `;
      document.getElementById('clearSelectionButton').onclick = function () {
        clearFields();
      };
      document.getElementById('name').value = place.name;
      blockField('name');
      document.getElementById('telefone').value = place.formatted_phone_number;
      document.getElementById('Endereço').value = place.formatted_address;
      blockField('Endereço');
      document.getElementById('weekday').value = workTime;
      document.getElementById('form-coord').value = JSON.stringify([coord.lng, coord.lat]);
      console.log(document.getElementById('form-coord').value);
      document.getElementById('form-placeID').value = place.place_id;
      document.getElementById('form-rating').value = place.rating;
      console.log(typeof (place.photos), typeof (typeof (place.photos)));
      if (typeof (place.photos) !== 'undefined') {
        place.photos.forEach((photo) => {
          document.getElementById('form-googlePhotos').innerHTML += `
          <input type="hidden" class="form-photosClass" name="googlePhotos[]" type="text" value="${photo.getUrl()}">
          `;
        });
      }
      console.log(typeof (place.reviews));
      if (typeof (place.reviews) !== 'undefined') {
        place.reviews.forEach((review) => {
          console.log(review);
          const {
            author_name, rating, relative_time_description, text,
          } = review;
          const reviewString = `{
          *name*:*${author_name}*, 
          *rating*:*${rating}*,
          *when*:*${relative_time_description}*
          }`;
          const reviewText = text;

          document.getElementById('form-googleReviews').innerHTML += `
          <input type="hidden" class="form-googleReviewClass" name="googleReviews[]" type="text" value="${reviewString}">`;
          document.getElementById('form-googleReviews').innerHTML += `
          <input type="hidden" class="form-googleReviewClass" name="googleReviewsText[]" type="text" value="${reviewText}">`;
          // console.log(reviewString, typeof (reviewString));
          console.log(document.getElementById('form-googleReviews'));
        });
      }
    }
  }
}

function blockField(field) {
  document.getElementById(field).readOnly = true;
  document.getElementById(field).classList.add('blocked');
  document.getElementById(field).onclick = function () {
    document.getElementById(`blockedField${field}`).innerHTML += `
    Campo não pode ser alterado. Se quiser cadastrar um local diferente clique em "Limpar Seleção"
    `;
  };
  document.getElementById(field).onfocusout = function () {
    document.getElementById(`blockedField${field}`).innerHTML = '';
  };
}

function clearFields() {
  document.getElementById('name').value = '';
  document.getElementById('name').readOnly = false;
  document.getElementById('name').classList.remove('blocked');
  document.getElementById('name').onclick = '';
  document.getElementById('telefone').value = '';
  document.getElementById('Endereço').value = '';
  document.getElementById('Endereço').readOnly = false;
  document.getElementById('Endereço').classList.remove('blocked');
  document.getElementById('Endereço').onclick = '';
  document.getElementById('weekday').value = '';
  document.getElementById('form-coord').value = '';
  document.getElementById('form-placeID').value = '';
  document.getElementById('form-rating').value = '';
  document.getElementById('form-googlePhotos').innerHTML = '';
  document.getElementById('form-googleReviews').innerHTML = '';
}
