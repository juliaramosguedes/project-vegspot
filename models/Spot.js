const mongoose = require('mongoose');

const { Schema } = mongoose;

const spotSchema = Schema(
  {
    authorId: { type: String, required: true },
    name: { type: String, required: true },
    phone: String,
    address: { type: String, required: true },
    coord: {
      lat: String,
      lng: String,
    },
    // zipcode: String,
    vegCategory: {
      type: String,
      enum: ['Vegan', 'Vegetariano', 'Vegan-Friendly'],
      required: true,
    },
    spotCategory: {
      type: String,
      enum: ['Restaurante', 'Loja'],
      required: true,
    },
    rating: { type: Number, required: true },
    googlePlaceId: { type: String },
    weekday: { type: String, required: true },
    photos: Array,
    googleReviews: Array,
    price: Number,
    status: {
      type: String,
      enum: ['ativo', 'inativo'],
      default: 'ativo',
    },
  },
);

const Spot = mongoose.model('Spot', spotSchema);

module.exports = Spot;
