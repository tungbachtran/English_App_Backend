const mongoose = require('mongoose');
const ExerciseOption = require('./exercise_option.model');
// Định nghĩa enum cho ChallengeType
const ChallengeType = {
  MULTIPLE_CHOICE: 'multipleChoice',
  PAIR_MATCHING: 'pairMatching',
  SENTENCE_ORDER: 'sentenceOrder',
  TRANSLATE_WRITTEN: 'translateWritten',
};

const exerciseSchema = new mongoose.Schema(
  {
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'lessons',
      required: true
    },
    exerciseType: {
      type: String,
      enum: Object.values(ChallengeType),
      required: true,
    },
    question: {
      type: String,
      required: true
    },
    audioUrl: {
      type: String,
      default: null, 
    },
    imageUrl: {
      type: String,
      default: null, 
    },
    acceptedAnswer: {
      type: Array,
      default: null, 
    },
    translateWord: {
      type: String,
      default: null, 
    },
    instruction: String,
    order: {
      type: Number,
      default: 0
    },
    difficultyLevel: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium'
    },
    points: {
      type: Number,
      default: 10
    }
  },
  
  {
    timestamps: true
  },
  );

const Exercise = mongoose.model("exercises", exerciseSchema);

module.exports = Exercise;

