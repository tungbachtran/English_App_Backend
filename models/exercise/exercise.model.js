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
      type: String,
      ref: 'lessons',
      required: true
    },
    exerciseType: {
      type: String,
      enum: Object.values(ChallengeType),
      required: true
    },
    instruction: {
      type: String,
      required: true
    },
    question: {
      type: String,
      default: null
    },
    
    audioUrl: {
      type: String,
      default: null
    },
    imageUrl: {
      type: String,
      default: null
    },
    
    order: {
      type: Number,
      default: 0
    }
   
   
  },
  
  {
    timestamps: true
  },
  );

const Exercise = mongoose.model("exercises", exerciseSchema);

module.exports = Exercise;

