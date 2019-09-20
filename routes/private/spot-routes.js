const passport = require('passport');
const express = require('express');

const Spot = require('../../models/Spot');
const router = express.Router();
const ensureLogin = require('connect-ensure-login');

const checkRoles = require('../../middlewares/passport-middleware');

const checkAchiever = checkRoles('achiever');

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

router.get('/add', (req, res, next) => {
  res.render('private/add');
});

router.post('/add', async (req, res) => {
  const { name, authorId, phone, address, coord, vegCategory, spotCategory, rating, googlePlaceId, weekday, photos, googleReviews, price } = req.body;
  
  if (name === "" || phone === "" || address === "" || vegCategory === "" || spotCategory === "" || rating === "" || weekday === "" || price === "") {
    res.render("private/add", { message: "Preencha todos os campos." });
    return;
  }
  
  Spot.findOne({ name })
  .then(user => {
    if (user) {
      res.render("private/add", { message: "O nome de usuário já existe" });
      return;
    }
    
    const newSpot = new Spot({ name, authorId, phone, address, coord, vegCategory, spotCategory, rating, googlePlaceId, weekday, photos, googleReviews, price, });
    newSpot.save((err) => {
      if (err) {
        res.render("private/add", { message: "Algo deu errado." });
      } else {
        res.redirect("/");
      }
    });
  })
  .catch(error => {
    next(error)
  })
})

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

module.exports = router;
