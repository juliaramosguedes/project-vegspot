window.onload = () => {
  let coord = document.getElementById('coord').value;
  coord = `[${coord}]`;
  coord = JSON.parse(coord.toString());
  coord = {
    lat: coord[1],
    lng: coord[0],
  };
  console.log(coord)
  addSingleMarker(coord)
};