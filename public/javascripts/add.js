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
      // document.getElementById('formatted-address').innerHTML += `
      // ${formattedAddress}
      // `;
      console.log('response', response, coord, formattedAddress, placeId);
      
      //addMarkerPlaces(places);
      findPlaces(address)
      document.getElementById('addLocalSearch').value = '';
    } catch (error) {
      console.log(error);
    }
 
  };

  document.getElementById('Endereço').onfocusout = async function () {
    let geoAddress = document.getElementById('Endereço').value;
    let geoInfo = await geocode(geoAddress)
    console.log(geoInfo.data.results.length)
    if(geoInfo.data.results.length > 0) {
      let geoCoord = JSON.stringify(geoInfo.data.results[0].geometry.location)
      console.log('geoCoord entrei', geoCoord)
      addSingleMarker(JSON.parse(geoCoord))
      document.querySelector(".form-coord").value = geoCoord;
      console.log(document.querySelector(".form-coord").value)
    } else {
      document.getElementById("addressChecker").innerHTML="Endereco nao eh valido"

    }



  }

}

//onblur() or onfocusout()