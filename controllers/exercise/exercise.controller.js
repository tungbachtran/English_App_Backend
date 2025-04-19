const mongoose = require('mongoose');
const Exercise = require('../../models/exercise/exercise.model');
const ExerciseOption = require('../../models/exercise/exercise_option.model');

// Lấy danh sách bài tập theo lessonId kèm đáp án đúng
module.exports.getExercisesByLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    console.log('LessonId từ params:', lessonId);

    // Lấy tất cả bài tập trong lesson, sắp xếp theo order
    const exercises = await Exercise.find({ lessonId }).sort({ order: 1 });
   

    // Xử lý dữ liệu trả về
    const response = await Promise.all(exercises.map(async (exercise) => {
      const exerciseObject = exercise.toObject();
      exerciseObject.id = exerciseObject._id.toString();
      delete exerciseObject._id;

      // Lọc các trường null
      Object.keys(exerciseObject).forEach(key => {
        if (exerciseObject[key] === null) {
          delete exerciseObject[key];
        }
      });

      // Xử lý khác nhau tùy theo loại bài tập
      if (exerciseObject.exerciseType === 'sentenceOrder') {
        // Lấy các options cho bài tập
        const options = await ExerciseOption.find({ exerciseId: exerciseObject.id });
        
        // Định dạng lại options
        const formattedOptions = options.map(option => {
          const optionObject = option.toObject();
          optionObject.id = optionObject._id.toString();
          delete optionObject._id;
          
          // Lọc các trường null
          Object.keys(optionObject).forEach(key => {
            if (optionObject[key] === null) {
              delete optionObject[key];
            }
          });
          
          return optionObject;
        });
        
        // Thêm sentenceLength vào data
        const data = {
          options: formattedOptions,
          
          sentenceLength: formattedOptions.length // Thêm sentenceLength
        };

        return {
          ...exerciseObject,
          data: data
        };
      } 
      else if (exerciseObject.exerciseType === 'translateWritten') {
        // Lấy options cho bài tập translateWritten
        const options = await ExerciseOption.find({ exerciseId: exerciseObject.id });
        
        if (options.length > 0) {
          // Lấy thông tin từ option đầu tiên
          const option = options[0].toObject();
          
          // Trả về data không bọc trong mảng options
          return {
            ...exerciseObject,
            data: {
              acceptedAnswer: option.acceptedAnswer || [],
              translateWord: option.translateWord || "",
             
            }
          };
        } else {
          return {
            ...exerciseObject,
            data: {
              acceptedAnswer: [],
              translateWord: "",
            
            }
          };
        }
      }
      else {
        // Xử lý các loại bài tập khác (giữ nguyên như cũ)
        const options = await ExerciseOption.find({ exerciseId: exerciseObject.id });
        
        // Tìm đáp án đúng
        const correctOption = options.find(option => option.correct === true);
        
        const data = {
          options: options.map(option => {
            const optionObject = option.toObject();
            optionObject.id = optionObject._id.toString();
            delete optionObject._id;
            
            // Lọc các trường null
            Object.keys(optionObject).forEach(key => {
              if (optionObject[key] === null) {
                delete optionObject[key];
              }
            });
            
            return optionObject;
          }),
         
        };

        return {
          ...exerciseObject,
          data: data
        };
      }
    }));

    res.status(200).json(response);
  } catch (error) {
    console.error('Lỗi khi lấy bài tập theo lesson:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy dữ liệu' });
  }
};

