window.onload = () => {
  const spots = document.querySelectorAll('.spot');
  console.log(spots);
  const places = [];
  spots.forEach((spot) => {
    const title = spot.children[1].children[0].innerText;
    const vegCategory = spot.children[1].children[1].innerText;
    const address = spot.children[1].children[2].innerText;
    let coord = spot.children[1].children[4].defaultValue;
    if (!coord) {
      coord = { lat: -23.5945984, lng: -46.6747392 };
    } else {
      coord = coord.toString()
      coord = JSON.parse(coord)
    }
    places.push({ 
title, vegCategory, address, coord 
});
  });
  console.log('array places', places);
  addMarker(places);
};