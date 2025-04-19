const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  unitId: {
    type: String,
    ref: 'units',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  order: {
    type: Number,
    required: true
  },
  iconUrl: {
    type: String,
    default: null
  },
  experienceReward: {
    type: Number,
    default: 10
  },
  requiredHearts: {
    type: Number,
    default: 1
  },
  timeLimit: {
    type: Number,  // thời gian giới hạn tính bằng giây
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Lesson = mongoose.model('lessons', lessonSchema);

module.exports = Lesson;
