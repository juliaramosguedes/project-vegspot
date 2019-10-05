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
    icon = 'data:image/png;base64,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';
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
      <button id="clearSelectionButton">Limpar Seleção</button>
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
