window.onload = () => {
  const inputSearchAddress = document.getElementById('addLocalSearch');
  const autocompleteSearch = new google.maps.places.Autocomplete(inputSearchAddress);
  autocompleteSearch.setComponentRestrictions({ country: ['br'] });

  const addAddress = document.getElementById('Endereço');
  const autocompleteAddress = new google.maps.places.Autocomplete(addAddress);
  autocompleteAddress.setComponentRestrictions({ country: ['br'] });

  document.getElementById('addLocalButton').onclick = async function (event) {
    try {
      event.preventDefault();
      const address = document.getElementById('addLocalSearch').value;
      // console.log('address', address);
      // findPlaces(address);

      const response = await geocode(address);
      const coord = response.data.results[0].geometry.location;
      const formattedAddress = response.data.results[0].formatted_address;
      const placeId = response.data.results[0].place_id;
      addSingleMarker(coord);
      // await placeDetails(placeId);
      // document.getElementById('formatted-address').innerHTML += `
      // ${formattedAddress}
      // `;
      console.log('response', response, coord, formattedAddress, placeId);
      // addMarkerPlaces(places);
      findPlaces(address);
      document.getElementById('addLocalSearch').value = '';
    } catch (error) {
      console.log(error);
    }
  };

  document.getElementById('Endereço').onfocusout = async function () {
    console.log(document.getElementById('Endereço').value.length)
    const addressValue = document.getElementById('Endereço').value;
    if(addressValue.length > 6) {
      const geoAddress = addressValue;
      const geoInfo = await geocode(geoAddress);
      if (geoInfo.data.results.length) {
        const geoCoord = JSON.stringify(geoInfo.data.results[0].geometry.location);
        console.log(geoCoord)
        addSingleMarker(JSON.parse(geoCoord));
        document.querySelector('#form-coord').value = geoCoord;
        console.log(document.getElementById('form-coord').value);
      } else {
        document.getElementById('addressChecker').innerHTML = 'Endereco nao eh valido';
      }
    }
  };
};
