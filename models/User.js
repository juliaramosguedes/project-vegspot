const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = Schema(
  {
    username: String,
    password: String,
    name: String,
    googleID: String,
    email: String,
    imgPath: { type: String, default: '' },
    role: {
      type: String,
      enum: ['user', 'achiever', 'admin', 'owner'],
      default: 'User',
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  },
);

const User = mongoose.model('User', userSchema);

module.exports = User;
