const mongoose = require('mongoose');

const { Schema } = mongoose;

const reviewSchema = Schema(
  {
    authorId: { type: String, required: true },
    spotId: { type: String, required: true },
    rating: { type: Number, required: true },
    date: { type: String, required: true },
    title: { type: String, required: true },
    text: { type: String, required: true },
  },
);

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
