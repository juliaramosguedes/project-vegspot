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
    if (!req.user || req.user.role === 'user') {
      const spots = await Spot.find({ status: 'ativo', name: { "$regex": searchSpot, "$options": "i" } });
      res.render('public/search', { spots });
    } else {
      const spots = await Spot.find({ name: { "$regex": searchSpot, "$options": "i" } });
      res.render('public/search', { spots });
    }
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

router.get('/add', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  res.render('private/spot-add');
});

router.post('/add', ensureLogin.ensureLoggedIn(), async (req, res, next) => {
  let { name, phone, address, description, coord, vegCategory, spotCategory, rating, googlePlaceId, weekday, photos, googleReviews, googleReviewsText, price, googlePhotos, googleRating } = req.body;
  coord = JSON.parse(coord.toString())

  // console.log('googleReviewsRaw', googleReviews, typeof(googleReviews))
  const reviewArray = []
  googleReviews.forEach((review, index) => {
    let reviewString = review.replace(/\*/g, '"');
    reviewString = JSON.parse(reviewString.toString());
    reviewString.text = googleReviewsText[index]
    reviewArray.push(reviewString);
  });
  googleReviews = reviewArray;
  
  const authorId = req.user.id;

  if (name === "" || phone === "" || address === "" || description === "" || vegCategory === "" || spotCategory === "" || rating === "" || weekday === "" || price === "") {
    res.render("private/spot-add", { message: "Preencha todos os campos." });
    return;
  }
  
  Spot.findOne({ googlePlaceId })
  .then(user => {
    if (user) {
      res.render("private/spot-add", { message: "O nome desse local já está cadastrado." });
      return;
    }
    const newSpot = new Spot({ name, authorId, phone, address, description, coord, vegCategory, spotCategory, rating, googlePlaceId, weekday, photos, googleReviews, googlePhotos, googleRating, price });
    newSpot.save((err) => {
      if (err) {
        console.log(err);
        res.render("private/spot-add", { message: "Algo deu errado." });
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
    // spot.googleReviews.forEach((review) => {
    //   console.log(review, typeof(reviewString))
    // });

    if (!req.user || req.user.role === 'user') {
      res.render('public/spot-profile', spot);
    } else {
      res.render('private/spot-adm', spot);
    }
  } catch (error) {
    console.log(error);
  }
});

router.get('/edit/:id', checkAchiever, async (req, res, next) => {
  const { id } = req.params;
  try {
    const spot = await Spot.findById(id);
    res.render('private/spot-edit', spot);
  } catch (error) {
    console.log(error);
  }
});

router.post('/edit/:id', checkAchiever, async (req, res, next) => {
  const { id } = req.params;
  const { name, phone, address, description, vegCategory, spotCategory, rating, weekday, price, photos, status } = req.body;
  const authorId = req.user.id;

  if (name === "" || phone === "" || address === "" || description === "" || vegCategory === "" || spotCategory === "" || rating === "" || weekday === "" || price === "") {
    res.render("private/spot-edit", { message: "Preencha todos os campos." });
    return;
  }

  try {
    await Spot.findByIdAndUpdate(id, { name, authorId, phone, address, description, vegCategory, spotCategory, rating, weekday, price, photos, status });
    res.redirect('/');
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;