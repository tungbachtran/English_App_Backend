const mongoose = require('mongoose');
const Exercise = require('./exercise.model');
// Định nghĩa schema cho ChallengeOption
const exerciseOptionSchema = new mongoose.Schema({
  
  exerciseId: {
    type: String,
    required: true,
  },
  correct: {
    type: Boolean,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  audioUrl: {
    type: String,
    default: null, // Mặc định là null nếu không có giá trị
  },
  imageUrl: {
    type: String,
    default: null, // Mặc định là null nếu không có giá trị
  },
  column:{
    type: String,
    default: null,
  }
});

// Tạo model từ schema
const ExerciseOption = mongoose.model('exercise_options', exerciseOptionSchema);

module.exports = ExerciseOption;