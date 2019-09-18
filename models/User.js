const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    category: {
      type: String,
      enum: ['Vegan', 'Vegetariano', 'Vegan-Friendly'],
      required: true,
    },
    googleID: String,
    email: { type: String, required: true },
    imgPath: { type: String, default: '' },
    role: {
      type: String,
      enum: ['user', 'achiever', 'admin', 'owner'],
      default: 'user',
    },
    status: {
      type: String,
      enum: ['ativo', 'inativo'],
      default: 'ativo',
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  },
);

const User = mongoose.model('User', userSchema);

module.exports = User;
