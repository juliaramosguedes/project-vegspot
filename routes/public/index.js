const express = require('express');
const Spot = require('../../models/Spot');

const router = express.Router();

/* GET home page */
router.get('/', async (req, res, next) => {
  let spot = {}
  spot['rating'] = await Spot.find().sort({ googleRating: -1 }).limit(5)
  spot['lastEntries'] = await Spot.find().sort({ date: -1 }).limit(5)
  res.render('public/index', { spot });
});

router.post('/', async (req, res, next) => {
  const { position, maxDistance } = req.body;
  const places = await Spot.find({
    coord: {
      $near: {
        $maxDistance: maxDistance,
        $geometry: {
          type: 'Point',
          coordinates: position,
        },
      },
    },
  });
  res.status(200).json(places);
});


module.exports = router;

