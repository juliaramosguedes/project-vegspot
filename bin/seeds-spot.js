require('dotenv').config();
const mongoose = require('mongoose');

const Spot = require('../models/Spot');

mongoose.connect(process.env.MONGODB_URI);

const spots = [
  {
    authorId: '1', 
    name: 'Julia',
    phone: '',
    address: '',
    coord: {
      lat: '',
      lng: '',
    },
    vegCategory: 'Vegan',
    spotCategory: 'Restaurante',
    email: 'julia@govegan.com',
    role: 'achiever',
    rating: 4.5,
    googlePlaceId: '',
    weekday: '',
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
