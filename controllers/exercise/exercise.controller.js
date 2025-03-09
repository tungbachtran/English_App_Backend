const Exercise = require('../../models/exercise/exercise.model');
const ExerciseOption = require('../../models/exercise/exercise_option.model');

// Controller để lấy danh sách bài tập và đáp án, chuyển _id thành id và loại bỏ các trường null
module.exports.index = async (req, res) => {
  try {
   
    const exercises = await Exercise.find();

   
    const options = await ExerciseOption.find();

    const response = exercises.map(exercise => {
      const exerciseObject = exercise.toObject();

    
      exerciseObject.id = exerciseObject._id.toString();
      delete exerciseObject._id;

      
      Object.keys(exerciseObject).forEach(key => {
        if (exerciseObject[key] === null) {
          delete exerciseObject[key];
        }
      });

      
      const data = {
        options: options
          .filter(option => option.exerciseId.toString() === exerciseObject.id)
          .map(option => {
            const optionObject = option.toObject();
            
           
            optionObject.id = optionObject._id.toString();
            delete optionObject._id;
            
            
            Object.keys(optionObject).forEach(key => {
              if (optionObject[key] === null) {
                delete optionObject[key];
              }
            });
            
            return optionObject;
          })
      };

      return {
        ...exerciseObject,
        data: data
      };
    });

    res.status(200).json(response);
  } catch (error) {
    console.error('Lỗi khi lấy bài tập:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy dữ liệu' });
  }
};