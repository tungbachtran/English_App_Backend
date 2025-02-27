const Exercise = require('../models/exercise.model');
const ExerciseOption = require('../models/exercise_option.model');

// Controller để lấy danh sách bài tập và đáp án
module.exports.index = async(req, res) => {
  try {
    // Lấy tất cả bài tập
    const exercises = await Exercise.find();
   
    // Lấy tất cả đáp án tương ứng với bài tập
    const exerciseIds = exercises.map(exercise => exercise._id);
    const options = await ExerciseOption.find();
   
    // Tổ chức dữ liệu để gửi về frontend
    const response = exercises.map(exercise => {
      return {
        ...exercise.toObject(), // Chuyển đổi Mongoose document thành object thông thường
        options: options.filter(option => option.exerciseId.toString() == exercise._id.toString()), // Lọc đáp án cho bài tập
      };
    });

  
    res.status(200).json(response);
  } catch (error) {
    console.error('Lỗi khi lấy bài tập:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy dữ liệu' });
  }
}


