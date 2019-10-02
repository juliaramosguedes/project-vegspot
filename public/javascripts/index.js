window.onload = async () => {
  const url = 'http://localhost:3000';
  // const url = `http://localhost:${process.env.PORT}`

  async function getNearPlaces() {
    const position = [pos.lng, pos.lat];
    const maxDistance = 8000;
    const results = await axios.post(`${url}/`, { position, maxDistance });
    return results;
  }

  const places = await getNearPlaces();
  console.log('placessss', places.data, places.data.coord);
  places.data.forEach((place, index) => {
    let {coord} = place;
    coord = {
      lat: coord[1],
      lng: coord[0],
    };
    places.data[index].coord = coord;
  });
  addMarker(places.data);
};