const passport = require('passport');
const express = require('express');

const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../../models/User');

const saltRounds = 10;

router.get('/login', (req, res, next) => {
  res.render('auth/login');
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/auth/login',
  failureFlash: true,
  passReqToCallback: true,
}));

router.get('/signup', (req, res) => {
  res.render('auth/signup');
});

router.post('/signup', async (req, res) => {
  let { username, password, name, category, email, role } = req.body;

  if (username === "" || password === "" || name === "" || category === "" || email === "" || role === "") {
    res.render("auth/signup", { message: "Preencha todos os campos." });
    return;
  }

  User.findOne({ username })
  .then(user => {
    if (user) {
      res.render("auth/signup", { message: "O nome de usuário já existe" });
      return;
    }

    const salt = bcrypt.genSaltSync(saltRounds);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      name,
      category,
      email,
      role,
      password: hashPass,
    });
    newUser.save((err) => {
      if (err) {
        res.render("auth/signup", { message: "Algo deu errado." });
      } else {
        res.redirect("/");
      }
    });
  })
  .catch(error => {
    next(error)
  })
})

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
