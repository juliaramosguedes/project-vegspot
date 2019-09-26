window.onload = () => {

  const inputSearchAddress = document.getElementById('addLocalSearch');
  const autocompleteSearch = new google.maps.places.Autocomplete(inputSearchAddress);

  const addName = document.getElementById('name');
  const autocompleteName = new google.maps.places.Autocomplete(addName);
  
  const addAddress = document.getElementById('Endereço');
  const autocompleteAddress = new google.maps.places.Autocomplete(addAddress);
  

  document.getElementById('addLocalButton').onclick = async function (event) {
    try {
      event.preventDefault();
      const address = document.getElementById('addLocalSearch').value;
      console.log('address', address);
      //findPlaces(address);
      
      const response = await geocode(address);
      const coord = response.data.results[0].geometry.location;
      const formattedAddress = response.data.results[0].formatted_address;
      const placeId = response.data.results[0].place_id;
      addSingleMarker(coord);
      //await placeDetails(placeId);
      document.getElementById('formatted-address').innerHTML += `
      ${formattedAddress}
      `;
      console.log('response', response, coord, formattedAddress, placeId);
      
      //addMarkerPlaces(places);
      const placesResult = await findPlaces(address)
      await console.log('placesResult', placesResult)
      document.getElementById('addLocalSearch').value = '';
    } catch (error) {
      console.log(error);
    }
 
  };

}
