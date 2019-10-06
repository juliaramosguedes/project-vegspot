const express = require('express');
const Spot = require('../../models/Spot');

const router = express.Router();

/* GET home page */
router.get('/', async (req, res, next) => {
  let spot = {}
  spot['rating'] = await Spot.find({ status: 'ativo' }).sort({ googleRating: -1 }).limit(4)
  spot['lastEntries'] = await Spot.find({ status: 'ativo' }).sort({ date: -1 }).limit(4)
  res.render('public/index', { spot });
});

router.post('/', async (req, res, next) => {
  const { position, maxDistance } = req.body;
  const places = await Spot.find({
    status: 'ativo',
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

