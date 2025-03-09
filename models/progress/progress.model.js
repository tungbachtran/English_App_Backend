const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProgressSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  lessonId: { type: Schema.Types.ObjectId, ref: 'Lesson', required: true },
  unitId: { type: Schema.Types.ObjectId, ref: 'Unit', required: true },
  status: {
    type: String,
    enum: ['completed', 'in_progress', 'not_started'],
    default: 'not_started'
  },
  score: { type: Number, default: 0 },
  accuracy: { type: Number, default: 0 },
  completionTime: { type: Number, default: 0 }, // tính bằng giây
  mistakes: [{
    questionId: { type: Schema.Types.ObjectId, ref: 'Question' },
    userAnswer: String,
    correctAnswer: String
  }],
  completedAt: { type: Date },
  streakCount: { type: Number, default: 0 },
  lastAttemptAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Thêm index để cải thiện hiệu suất truy vấn
ProgressSchema.index({ userId: 1, lessonId: 1 });
ProgressSchema.index({ userId: 1, unitId: 1 });

module.exports = mongoose.model('progresses', ProgressSchema);
