const express = require('express');

const router = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('public/index');
});

module.exports = router;


// var schema = new Schema({
//   name: {
//       type: String,
//       unique: false,
//       required: true
//   },
//   location: {
//       type: [Number],  // [<longitude>, <latitude>]
//       index: '2dsphere',     // create the geospatial index
//       required: false // true senare
//   }
// });

// schema.statics.getNearby = function (longitude, latitude, minDistance, maxDistance, callback) {

//   if ((longitude || latitude) === undefined) return new ModelError("location or radius is missing");
  
//   var Places = this;
//   var point = { type: "Point", coordinates: [ longitude, latitude]};
//   Places.geoNear(point, { minDistance: parseFloat(minDistance), maxDistance : maxDistance},
//       function(err, activities, stats) {
//           if (err)  return callback(err);
//           callback(null, activities);
//   });