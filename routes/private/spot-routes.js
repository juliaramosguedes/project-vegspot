const passport = require('passport');
const express = require('express');

const router = express.Router();
const ensureLogin = require("connect-ensure-login");

const checkRoles = require('../../middlewares/passport-middleware');

const checkAchiever  = checkRoles('achiever');

module.exports = router
