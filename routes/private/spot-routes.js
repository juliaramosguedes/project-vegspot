const passport = require('passport');
const express = require('express');

const Spot = require('../../models/Spot');
const Review = require('../../models/Review');

const router = express.Router();
const ensureLogin = require('connect-ensure-login');

const checkRoles = require('../../middlewares/passport-middleware');

const checkAchiever = checkRoles('achiever');

router.post('/search', async (req, res) => {
  const { searchSpot } = req.body;
  try {
    if (!req.user || req.user.role === 'user') {
      const spots = await Spot.find({ status: 'ativo', name: { $regex: searchSpot, $options: 'i' } });
      res.render('public/search', { spots });
    } else {
      const spots = await Spot.find({ name: { $regex: searchSpot, $options: 'i' } });
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
  let {
    name, phone, address, description, coord, vegCategory, spotCategory, rating, googlePlaceId, weekday, photos, googleReviews, googleReviewsText, price, googlePhotos, googleRating,
  } = req.body;
  coord = JSON.parse(coord.toString());

  const reviewArray = [];
  googleReviews.forEach((review, index) => {
    let reviewString = review.replace(/\*/g, '"');
    reviewString = JSON.parse(reviewString.toString());
    reviewString.text = googleReviewsText[index];
    reviewArray.push(reviewString);
  });
  googleReviews = reviewArray;

  const authorId = req.user.id;

  if (name === '' || phone === '' || address === '' || description === '' || vegCategory === '' || spotCategory === '' || rating === '' || weekday === '' || price === '') {
    res.render('private/spot-add', { message: 'Preencha todos os campos.' });
    return;
  }

  Spot.findOne({ googlePlaceId })
    .then((user) => {
      if (user) {
        res.render('private/spot-add', { message: 'O nome desse local já está cadastrado.' });
        return;
      }

      let verified = false;

      if (req.user.role === 'achiever') {
        verified = true;
      }

      const newSpot = new Spot({
        name, authorId, phone, address, description, coord, vegCategory, spotCategory, rating, googlePlaceId, weekday, photos, googleReviews, googlePhotos, googleRating, price, verified,
      });
      newSpot.save((err) => {
        if (err) {
          console.log(err);
          res.render('private/spot-add', { message: 'Algo deu errado.' });
        } else {
          res.redirect('/');
        }
      });
    })
    .catch((error) => {
      next(error);
    });
});

router.get('/profile/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const spot = await Spot.findById(id);
    spot.review = await Review.find({ spotId: `${id}` });
    if ((spot.review.length)) {
      let averageRating = 0;
      spot.review.forEach((review, index) => {
        if (typeof req.user !== 'undefined') {
          if (review.authorId === req.user.id) {
            spot.review[index].edit = true;
          } else {
            spot.review[index].edit = false;
          }
        }
        averageRating += review.rating;
        const date = new Date(review.created_at);
        const year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        if (day < 10) {
          day = `0${day}`;
        }
        if (month < 10) {
          month = `0${month}`;
        }
        spot.review[index].date = { day, month, year };
      });
      spot.review.averageRating = averageRating / spot.review.length;
    }

    if (typeof req.user !== 'undefined') {
      if (req.user.role === 'achiever') {
        spot.achiever = true;
      }
    }
    res.render('public/spot-profile', spot);
    // if (!req.user || req.user.role === 'user') {
    //   res.render('public/spot-profile', spot);
    // } else {
    //   res.render('private/spot-adm', spot);
    // }
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
  const {
    name, phone, address, description, vegCategory, spotCategory, rating, weekday, price, photos, status, verified,
  } = req.body;
  const authorId = req.user.id;

  if (name === '' || phone === '' || address === '' || description === '' || vegCategory === '' || spotCategory === '' || rating === '' || weekday === '' || price === '') {
    res.render('private/spot-edit', { message: 'Preencha todos os campos.' });
    return;
  }

  try {
    await Spot.findByIdAndUpdate(id, {
      name, authorId, phone, address, description, vegCategory, spotCategory, rating, weekday, price, photos, status, verified,
    });
    res.redirect('/');
  } catch (error) {
    console.log(error);
  }
});


module.exports = router;
