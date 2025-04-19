const mongoose = require('mongoose');

const userLessonProgressSchema = new mongoose.Schema({
  userId: {
    type: String,
    ref: 'users',
    required: true
  },
  lessonId: {
    type: String,
    ref: 'lessons',
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  score: {
    type: Number,
    default: 0
  },
  totalExercises: {
    type: Number,
    default: 0
  },
  correctAnswers: {
    type: Number,
    default: 0
  },
  heartsUsed: {
    type: Number,
    default: 0
  },
  experienceGained: {
    type: Number,
    default: 0
  },
  timeSpent: {
    type: Number,  // thời gian làm bài tính bằng giây
    default: 0
  },
  completedAt: {
    type: Date,
    default: null
  },
  attempts: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Tạo index cho việc tìm kiếm nhanh
userLessonProgressSchema.index({ userId: 1, lessonId: 1 }, { unique: true });

const UserLessonProgress = mongoose.model('user_lesson_progress', userLessonProgressSchema);

module.exports = UserLessonProgress;
