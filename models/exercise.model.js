const mongoose = require('mongoose');
const ExerciseOption = require('./exercise_option.model');
// Định nghĩa enum cho ChallengeType
const ChallengeType = {
  MULTIPLE_CHOICE: 'multipleChoice',
  PAIR_MATCHING: 'pairMatching',
  SENTENCE_ORDER: 'sentenceOrder',
  TRANSLATE_WRITTEN: 'translateWritten',
};
const exerciseSchema = new mongoose.Schema({
   
    exerciseType: {
      type: String,
      enum: Object.values(ChallengeType),
      required: true,
    },
    question: String,
    order: Number
    
  });

const Exercise = mongoose.model("exercises", exerciseSchema);

module.exports = Exercise;