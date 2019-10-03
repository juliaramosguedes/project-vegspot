window.onload = async () => {
  let maxDistance
  const url = 'http://localhost:3000';
  // const url = `http://localhost:${process.env.PORT}`

  async function getNearPlaces(maxDistance) {
    const position = [pos.lng, pos.lat];
    const results = await axios.post(`${url}/`, { position, maxDistance });
    return results;
  }

  async function loadNearPlaces() {
    maxDistance = Number(document.getElementById('nearRange').value);
    const places = await getNearPlaces(maxDistance);
    console.log('placessss', places.data);
    console.log('maxdistance loading page', maxDistance, typeof(maxDistance))
    if (places.data.length) {
      places.data.forEach((place, index) => {
        let {coord} = place;
        coord = {
          lat: coord[1],
          lng: coord[0],
        };
        places.data[index].coord = coord;
      });
      console.log('placessss', places.data);
      addMarker(places.data);
    } else {
      document.getElementById("nearPlacesMessage").innerHTML = `
      Nao foram encontrados lugares proximos a voce em ${maxDistance} metros.
      Aumente a area de busca ou cadastre novos lugares!
      `;
    }
  }
 
  loadNearPlaces(maxDistance)

  document.getElementById('nearRange').onchange = async function () {
    loadNearPlaces();
  }
};


