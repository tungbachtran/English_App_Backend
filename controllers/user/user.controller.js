const User = require('../../models/user/user.model');
const UserLessonProgress = require('../../models/user/user_lesson_progress.model');
const UserMistake = require('../../models/user/user_mistake.model');

// Lấy thông tin người dùng
module.exports.getUserInfo = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
    
    const userObj = user.toObject();
    userObj.id = userObj._id.toString();
    delete userObj._id;
    delete userObj.password;
    
    // Lấy thông tin tiến độ học tập
    const progress = await UserLessonProgress.find({ userId });
    
    // Tính tổng số bài học đã hoàn thành
    const completedLessons = progress.filter(p => p.completed).length;
    
    // Tính tổng kinh nghiệm đã nhận được
    const totalExperience = progress.reduce((sum, p) => sum + p.experienceGained, 0);
    
    // Tính tổng thời gian học tập (giây)
    const totalTimeSpent = progress.reduce((sum, p) => sum + p.timeSpent, 0);
    
    // Lấy số lượng câu sai
    const mistakeCount = await UserMistake.countDocuments({ userId });
    
    // Lấy số lượng câu sai đã thành thạo
    const masteredMistakeCount = await UserMistake.countDocuments({ 
      userId, 
      mastered: true 
    });
    
    res.status(200).json({
      ...userObj,
      stats: {
        completedLessons,
        totalExperience,
        totalTimeSpent,
        mistakeCount,
        masteredMistakeCount
      }
    });
  } catch (error) {
    console.error('Lỗi khi lấy thông tin người dùng:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy dữ liệu' });
  }
};

// Cập nhật tim cho người dùng
module.exports.updateHearts = async (req, res) => {
  try {
    const { userId } = req.params;
    const { hearts, operation } = req.body;
    
    if (!hearts || !operation) {
      return res.status(400).json({ message: 'Thiếu thông tin cần thiết' });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
    
    if (operation === 'add') {
      user.hearts += hearts;
    } else if (operation === 'subtract') {
      user.hearts = Math.max(0, user.hearts - hearts);
    } else if (operation === 'set') {
      user.hearts = hearts;
    } else {
      return res.status(400).json({ message: 'Thao tác không hợp lệ' });
    }
    
    await user.save();
    
    res.status(200).json({
      userId: user._id.toString(),
      hearts: user.hearts,
      message: 'Đã cập nhật số tim thành công'
    });
  } catch (error) {
    console.error('Lỗi khi cập nhật tim:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật dữ liệu' });
  }
};

// Lấy thống kê học tập theo ngôn ngữ
module.exports.getLanguageStats = async (req, res) => {
  try {
    const { userId, languageId } = req.params;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
    
    // Lấy thông tin ngôn ngữ của user
    const languageProgress = user.languages.find(
      lang => lang.languageId.toString() === languageId
    );
    
    if (!languageProgress) {
      return res.status(404).json({ message: 'Người dùng chưa học ngôn ngữ này' });
    }
    
    // Lấy danh sách lesson đã hoàn thành trong ngôn ngữ này
    const Unit = require('../../models/unit/unit.model');
    const Lesson = require('../../models/lesson/lesson.model');
    
    // Lấy tất cả unit của ngôn ngữ
    const units = await Unit.find({ languageId });
    const unitIds = units.map(unit => unit._id);
    
    // Lấy tất cả lesson trong các unit
    const lessons = await Lesson.find({ unitId: { $in: unitIds } });
    const lessonIds = lessons.map(lesson => lesson._id);
    
    // Lấy tiến độ của các lesson
    const progress = await UserLessonProgress.find({
      userId,
      lessonId: { $in: lessonIds },
      completed: true
    });
    
    // Tính tổng kinh nghiệm đã nhận được
    const totalExperience = progress.reduce((sum, p) => sum + p.experienceGained, 0);
    
    // Tính tổng thời gian học tập (giây)
    const totalTimeSpent = progress.reduce((sum, p) => sum + p.timeSpent, 0);
    
    // Lấy số lượng câu sai trong ngôn ngữ này
    const mistakeCount = await UserMistake.countDocuments({ 
      userId, 
      languageId 
    });
    
    // Lấy số lượng câu sai đã thành thạo
    const masteredMistakeCount = await UserMistake.countDocuments({ 
      userId, 
      languageId,
      mastered: true 
    });
    
    res.status(200).json({
      userId,
      languageId,
      experience: languageProgress.experience,
      level: languageProgress.level,
      completedLessons: progress.length,
      totalUnits: units.length,
      totalLessons: lessons.length,
      totalExperience,
      totalTimeSpent,
      mistakeCount,
      masteredMistakeCount
    });
  } catch (error) {
    console.error('Lỗi khi lấy thống kê ngôn ngữ:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy dữ liệu' });
  }
};
