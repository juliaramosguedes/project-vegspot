window.onload = async () => {
  let position;
  const url = 'http://localhost:3000';
  // const url = `http://localhost:${process.env.PORT}`

  const inputChangeLocation = document.getElementById('changeLocation');
  const autocompleteLocation = new google.maps.places.Autocomplete(inputChangeLocation);
  autocompleteLocation.setComponentRestrictions({ country: ['br'] });

  async function getNearPlaces(maxDistance) {
    console.log('position nearplaces', position);
    if (typeof (position) === 'undefined') {
      position = [pos.lng, pos.lat];
      console.log('position if', position);
    }
    const results = await axios.post(`${url}/`, { position, maxDistance });
    return results;
  }

  async function loadNearPlaces(maxDistance) {
    document.getElementById('nearSpotList').innerHTML = '';
    const places = await getNearPlaces(maxDistance);
    console.log('placessss', places.data);
    console.log('maxdistance loading page', maxDistance, typeof (maxDistance));
    if (places.data.length) {
      places.data.forEach((place, index) => {
        const distance = getDistance(place.coord)
        document.getElementById('nearSpotList').innerHTML += `
        <li><a href="/spot/profile/${place._id}">${place.name}</a> <br>
        ${place.address} - ${distance} km
        `;
        let { coord } = place;
        coord = {
          lat: coord[1],
          lng: coord[0],
        };
        places.data[index].coord = coord;
      });
      console.log('placessss', places.data);
      addMarker(places.data);
    } else {
      document.getElementById('nearPlacesMessage').innerHTML = `
      Nao foram encontrados lugares proximos a voce em ${maxDistance} metros.
      Aumente a area de busca ou cadastre novos lugares!
      `;
    }
  }

  function getDistance(coord2) {
    const lat1 = position[1];
    const lon1 = position[0];
    const lat2 = coord2[1];
    const lon2 = coord2[0];
    const R = 6371e3; // metres
    const φ1 = toRadians(lat1);
    const φ2 = toRadians(lat2);
    const Δφ = toRadians(lat2 - lat1);
    const Δλ = toRadians(lon2 - lon1);

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2)
            + Math.cos(φ1) * Math.cos(φ2)
            * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const d = R * c / 1000;
    console.log(d)
    return d.toFixed(1);
  }

  function toRadians(coord) {
    return coord * Math.PI / 180;

  }

  loadNearPlaces(500);

  document.getElementById('nearRange').onchange = async function () {
    const maxDistanceText = (document.getElementById('nearRange').value);
    console.log('maxdistancetext', maxDistanceText)
    let maxDistance
    switch (maxDistanceText) {
      case '0.5 km':
        maxDistance = 500;
        break;
      case '1 km':
        maxDistance = 1000;
        break;
      case '5 km':
        maxDistance = 5000;
        break;
      case '10 km':
        maxDistance = 10000;
        break;
    }
    console.log(maxDistance, typeof(maxDistance))
    loadNearPlaces(maxDistance);
  };

  document.getElementById('changeLocationButton').onclick = async function () {
    const location = document.getElementById('changeLocation').value;
    const geoInfo = await geocode(location);
    const coord = geoInfo.data.results[0].geometry.location;
    console.log('geo', coord);
    position = [coord.lng, coord.lat];
    console.log('coord click', coord);
    loadNearPlaces(coord);
    document.getElementById('changeLocation').value = '';
  };
};
