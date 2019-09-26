 window.onload = () => {
  const spots = document.querySelectorAll('.spot');
  let places = []
  spots.forEach((spot) => {
    const title = spot.children[1].children[0].innerText;
    const vegCategory = spot.children[1].children[1].innerText;
    const address = spot.children[1].children[2].innerText;
    const coord = spot.children[1].children[4].innerText;
    places.push({title, vegCategory, address, coord})
  })
  addMarker(places);
}