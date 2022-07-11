const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: Number,
    required: true,
    default: 3
  },
  credits: {
    type: Number,
    default: 0
  },
  verified: {
    type: Boolean,
    required: true,
    default: false
  },
  status: {
    type: Number,
    required: true,
    default: 0
  }
});

const UserModel = mongoose.model('user', userSchema);

module.exports = UserModel;
