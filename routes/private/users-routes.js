const passport = require('passport');
const express = require('express');

const router = express.Router();
const ensureLogin = require("connect-ensure-login");

const checkRoles = require('../../middlewares/passport-middleware');

const checkAchiever  = checkRoles('achiever');

// router.get('/show-users', ensureLogin.ensureLoggedIn(), async (req, res) => {
//   try {
//     const users = await User.find();
//     res.render('private/show-users', { users });
//   } catch (error) {
//     console.log(error);
//   }
// });

// router.get('/user-detail/:id', ensureLogin.ensureLoggedIn(), async (req, res) => {
//   const { id } = req.params;
//   try {
//     const user = await User.findById(id);
//     if(req.user.role === 'Boss'){
//       res.render('private/user-detail-boss', user);
//     } else {
//       res.render('private/user-detail', user);
//     }
//   } catch (error) {
//     console.log(error);
//   }
// });

// router.post('/edit/:id', checkAchiever, async (req, res) => {
//   const { id } = req.params;
//   const { name, role, username } = req.body;
//   try {
//     await User.findByIdAndUpdate(id, { name, role, username });
//     res.redirect('/show-users');
//   } catch (error) {
//     console.log(error);
//   }
// });

// router.get('/edit-password', ensureLogin.ensureLoggedIn(), (req, res) => {
//   res.render('private/edit-password', { id: req.user._id });
// });

// router.post('/edit-password/:id', ensureLogin.ensureLoggedIn(), async (req, res) => {
//   const { id } = req.params;
//   const { password } = req.body;
//   console.log(password, 'string grandonaaaaaaaaaaaaaaaaaaaaaaaaaa');
//   if (password === '') {
//     res.render('private/edit-password', { errorMessage: 'Required password!' });
//     return;
//   }
//   const salt = bcrypt.genSaltSync(saltRounds);
//   const hashPass = bcrypt.hashSync(password, salt);

//   try {
//     await User.findByIdAndUpdate(id, { password: hashPass });
//     res.redirect('/show-users');
//   } catch (error) {
//     console.log(error);
//   }
// });