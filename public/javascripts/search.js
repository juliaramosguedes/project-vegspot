window.onload = () => {
  const spots = document.querySelectorAll('.spot');
  const places = [];
  spots.forEach((spot) => {
    const title = spot.children[1].children[0].innerText;
    const vegCategory = spot.children[1].children[1].innerText;
    const address = spot.children[1].children[2].innerText;
    let coord = spot.children[1].children[4].defaultValue;
    coord = `[${coord}]`;
    coord = JSON.parse(coord.toString());
    if (!coord) {
      coord = { lat: -23.5945984, lng: -46.6747392 };
    } else {
      coord = {
        lat: coord[1],
        lng: coord[0],
      };
      console.log(coord)
    }
    places.push({
      title, vegCategory, address, coord,
    });
  });
  addMarker(places);
};
