window.onload = () => {
  const url = `http://localhost:3000`
  //const url = `http://localhost:${process.env.PORT}`


  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      console.log(pos)
      getNearPlaces()
    })
  }


  async function getNearPlaces () {
    await axios.post(`${url}/`, pos)
  }
};