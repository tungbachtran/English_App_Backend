const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    default: ''
  },
  avatar: {
    type: String,
    default: null
  },
  hearts: {
    type: Number,
    default: 5
  },
  experience: {
    type: Number,
    default: 0
  },
  streak: {
    type: Number,
    default: 0
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  languages: [{
    languageId: {
      type: String,
      ref: 'languages'
    },
    level: {
      type: Number,
      default: 0
    },
    experience: {
      type: Number,
      default: 0
    }
  }]
}, {
  timestamps: true
});

const User = mongoose.model('users', userSchema);

module.exports = User;
