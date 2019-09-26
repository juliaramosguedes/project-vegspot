require('dotenv').config();
const mongoose = require('mongoose');

const Spot = require('../models/Spot');

mongoose.connect(process.env.MONGODB_URI);

const spots = [
  {
    authorId: '1',
    name: 'Teste',
    phone: '',
    address: 'alameda jau, 1301',
    coord: {
      lat: '',
      lng: '',
    },
    vegCategory: 'Vegan',
    spotCategory: 'Restaurante',
    rating: 4.5,
    googlePlaceId: '',
    weekday: 'segunda a sabado, 08:00 as 22:00',
    photos: [],
    googleReviews: [],
    price: 3,
},
];

Spot.insertMany(spots, (err) => {
  if (err) {
    throw new Error(err);
  }
  console.log(`Created ${spots.length} spots!`);
  mongoose.connection.close();
});
