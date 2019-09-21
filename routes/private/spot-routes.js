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
    const spots = await Spot.find({ name: { "$regex": searchSpot, "$options": "i" } });
    res.render('public/search', { spots });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

router.get('/add', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  res.render('private/add');
});

router.post('/add', ensureLogin.ensureLoggedIn(), async (req, res, next) => {
  const { name, phone, address, description, coord, vegCategory, spotCategory, rating, googlePlaceId, weekday, photos, googleReviews, price } = req.body;
  console.log(req.body);
  const authorId = req.user.id;
  console.log(authorId);

  if (name === "" || phone === "" || address === "" || description === "" || vegCategory === "" || spotCategory === "" || rating === "" || weekday === "" || price === "") {
    res.render("private/add", { message: "Preencha todos os campos." });
    return;
  }
  
  Spot.findOne({ name })
  .then(user => {
    if (user) {
      res.render("private/add", { message: "O nome desse local já está cadastrado." });
      return;
    }
    
    const newSpot = new Spot({ name, authorId, phone, address, description, coord, vegCategory, spotCategory, rating, googlePlaceId, weekday, photos, googleReviews, price });
    newSpot.save((err) => {
      if (err) {
        console.log(err);
        res.render("private/add", { message: "Algo deu errado." });
      } else {
        res.redirect("/");
      }
    });
  })
  .catch(error => {
    next(error);
  })
})

router.get('/profile/:id', async (req, res, next) => {
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
