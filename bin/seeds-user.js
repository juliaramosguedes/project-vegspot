require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
const hash = bcrypt.hashSync(process.env.ADM_PASSWORD, salt);
const User = require('../models/User');

mongoose.connect(process.env.MONGODB_URI);

const admin = {
  name: 'Julia Ramos',
  username: 'julia',
  password: hash,
  category: 'Vegan',
  email: 'julia@govegan.com',
  role: 'achiever',
};

User.create(admin, (err) => {
  if (err) {
    throw new Error(err);
  }
  console.log(`Created ${admin.username}!`);
  mongoose.connection.close();
});
