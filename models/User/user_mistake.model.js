const mongoose = require('mongoose');

const userMistakeSchema = new mongoose.Schema({
  userId: {
    type: String,
    ref: 'users',
    required: true
  },
  exerciseId: {
    type: String,
    ref: 'exercises',
    required: true
  },
  selectedOptionId: {
    type: String,
    ref: 'exercise_options',
    required: true
  },
  correctOptionId: {
    type: String,
    ref: 'exercise_options',
    required: true
  },
  lessonId: {
    type: String,
    ref: 'lessons',
    required: true
  },
  unitId: {
    type: String,
    ref: 'units',
    required: true
  },
  languageId: {
    type: String,
    ref: 'languages',
    required: true
  },
  reviewedCount: {
    type: Number,
    default: 0
  },
  lastReviewed: {
    type: Date,
    default: null
  },
  mastered: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const UserMistake = mongoose.model('user_mistakes', userMistakeSchema);

module.exports = UserMistake;
