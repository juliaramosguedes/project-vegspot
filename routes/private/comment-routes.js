const passport = require('passport');
const express = require('express');

const Review = require('../../models/Review');

const router = express.Router();
const ensureLogin = require('connect-ensure-login');

const checkRoles = require('../../middlewares/passport-middleware');

const checkAchiever = checkRoles('achiever');

router.post('/add', ensureLogin.ensureLoggedIn(), async (req, res, next) => {
  const {
    authorId, authorName, spotId, title, text, rating,
  } = req.body;

  if (authorId === '' || spotId === '' || title === '' || text === '' || rating === '') {
    res.render('public/spot-profile', { message: 'Preencha todos os campos.' });
    return;
  }

  if (req.user) {
    const newReview = await new Review({
      authorId, authorName, spotId, rating, title, text,
    });
    newReview.save((err) => {
      if (err) {
        console.log(err);
      } else {
        res.status(200).json(true);
      }
    });
  } else {
    res.render('public/spot-profile', { message: 'Por favor faça o login.' });
  }
});

router.post('/edit', ensureLogin.ensureLoggedIn(), async (req, res, next) => {
  const {
    authorId, authorName, spotId, title, text, rating, commentId,
  } = req.body;

  if (authorId === '' || authorName === '' || spotId === '' || title === '' || text === '' || rating === '' || commentId === '') {
    res.render('public/spot-profile', { message: 'Preencha todos os campos.' });
    return;
  }

  try {
    await Review.findByIdAndUpdate(commentId, {
      authorId, authorName, spotId, title, text, rating,
    });
    res.status(200).json(true);
  } catch (error) {
    console.log(error);
  }
});

router.post('/delete', ensureLogin.ensureLoggedIn(), async (req, res, next) => {
  const { commentId } = req.body;
  try {
    await Review.deleteOne({ _id: commentId });
    res.status(200).json(true);
  } catch (error) {
    console.log(error);
  }
});

router.post('/get', async (req, res, next) => {
  const { spotId } = req.body;
  try {
    const reviewResult = await Review.find({ spotId: `${spotId}` });
    res.status(200).json(reviewResult);
  } catch (error) {
    console.log(error);
  }
});


module.exports = router;
