const mongoose = require('mongoose');

const { Schema } = mongoose;

const spotSchema = Schema(
  {
    authorId: { type: String, required: true },
    name: { type: String, required: true },
    phone: String,
    address: { type: String, required: true },
    description: { type: String, required: true },
    coord: {
      type: [Number], // [<longitude>, <latitude>]
      index: '2dsphere',
      required: true,
    },
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
    googlePhotos: Array,
    googleRating: Number,
    price: Number,
    status: {
      type: String,
      enum: ['ativo', 'inativo'],
      default: 'ativo',
    },
    verified: Boolean,
    date: { type: Date, default: Date.now },
  },
);

const Spot = mongoose.model('Spot', spotSchema);

module.exports = Spot;
