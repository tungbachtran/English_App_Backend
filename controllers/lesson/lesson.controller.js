const Lesson = require('../../models/lesson/lesson.model');
const UserLessonProgress = require('../../models/user/user_lesson_progress.model');
const Exercise = require('../../models/exercise/exercise.model');

// Lấy danh sách lesson theo unit
module.exports.getLessonsByUnit = async (req, res) => {
  try {
    const { unitId } = req.params;
    const { userId } = req.query;
    
    const lessons = await Lesson.find({ unitId, isActive: true }).sort({ order: 1 });
    
    // Lấy tiến độ của người dùng cho các lesson này
    let userProgress = [];
    if (userId) {
      userProgress = await UserLessonProgress.find({ 
        userId, 
        lessonId: { $in: lessons.map(lesson => lesson._id) } 
      });
    }
    
    const response = lessons.map(lesson => {
      const lessonObj = lesson.toObject();
      lessonObj.id = lessonObj._id.toString();
      delete lessonObj._id;
      
      // Thêm thông tin tiến độ
      const progress = userProgress.find(
        p => p.lessonId.toString() === lessonObj.id
      );
      
      lessonObj.progress = progress ? {
        completed: progress.completed,
        score: progress.score,
        attempts: progress.attempts
      } : {
        completed: false,
        score: 0,
        attempts: 0
      };
      
      return lessonObj;
    });
    
    res.status(200).json(response);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách lesson:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy dữ liệu' });
  }
};

// Lấy chi tiết lesson
module.exports.getLessonById = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;
    
    const lesson = await Lesson.findById(id);
    
    if (!lesson) {
      return res.status(404).json({ message: 'Không tìm thấy bài học' });
    }
    
    // Đếm số lượng exercise trong lesson
    const exerciseCount = await Exercise.countDocuments({ lessonId: id });
    
    // Lấy tiến độ của người dùng cho lesson này
    let progress = null;
    if (userId) {
      progress = await UserLessonProgress.findOne({ userId, lessonId: id });
    }
    
    const lessonObj = lesson.toObject();
    lessonObj.id = lessonObj._id.toString();
    delete lessonObj._id;
    
    lessonObj.exerciseCount = exerciseCount;
    lessonObj.progress = progress ? {
      completed: progress.completed,
      score: progress.score,
      correctAnswers: progress.correctAnswers,
      totalExercises: progress.totalExercises,
      heartsUsed: progress.heartsUsed,
      experienceGained: progress.experienceGained,
      timeSpent: progress.timeSpent,
      attempts: progress.attempts
    } : {
      completed: false,
      score: 0,
      correctAnswers: 0,
      totalExercises: 0,
      heartsUsed: 0,
      experienceGained: 0,
      timeSpent: 0,
      attempts: 0
    };
    
    res.status(200).json(lessonObj);
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết lesson:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy dữ liệu' });
  }
};
