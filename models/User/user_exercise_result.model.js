const mongoose = require('mongoose');

const userExerciseResultSchema = new mongoose.Schema({
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
  lessonId: {
    type: String,
    ref: 'lessons',
    required: true
  },
  selectedOptionId: {
    type: String,
    ref: 'exercise_options',
    required: true
  },
  isCorrect: {
    type: Boolean,
    required: true
  },
  timeTaken: {
    type: Number,  // thời gian làm câu này (giây)
    default: 0
  },
  attemptNumber: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

const UserExerciseResult = mongoose.model('user_exercise_results', userExerciseResultSchema);

module.exports = UserExerciseResult;
