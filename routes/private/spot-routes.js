const passport = require('passport');
const express = require('express');

const Spot = require('../../models/Spot');
const router = express.Router();
const ensureLogin = require('connect-ensure-login');

const checkRoles = require('../../middlewares/passport-middleware');

const checkAchiever  = checkRoles('achiever');

router.post('/search', async (req, res) => {
  const { searchSpot } = req.body;
  try {
    const spots = await Spot.find({ name: searchSpot });
    res.render('public/search', { spots });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const spot = await Spot.findById(id);
    if (req.user.role === 'achiever') {
      res.render('private/spot-adm', spot);
    } else {
      res.render('public/spot-profile', spot);
    }
  } catch (error) {
    console.log(error);
  }
});


module.exports = router
