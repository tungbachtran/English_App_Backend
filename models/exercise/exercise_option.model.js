const mongoose = require('mongoose');
const Exercise = require('./exercise.model');
// Định nghĩa schema cho ChallengeOption
const exerciseOptionSchema = new mongoose.Schema({
  exerciseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'exercises',
    required: true,
    default: null
  },
  correct: {
    type: Boolean,
    required: true,
    default: null
  },
  text: {
    type: String,
    required: true,
    default: null
  },
  audioUrl: {
    type: String,
    default: null, 
  },
  imageUrl: {
    type: String,
    default: null, 
  },
  column: {
    type: String,
    default: null, 
  },
  order: {
    type: Number,
    default: null 
  }
}, {
  timestamps: true
});


const ExerciseOption = mongoose.model('exercise_options', exerciseOptionSchema);

module.exports = ExerciseOption;