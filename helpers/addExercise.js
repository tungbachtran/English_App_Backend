const mongoose = require('mongoose');
const Exercise = require('./exercise.model');
const ExerciseOption = require('./exerciseOption.model');



// Hàm để thêm bài tập và đáp án
async function addExerciseWithOptions() {
  try {
    // 1. Tạo bài tập mới
    const newExercise = new Exercise({
      lessonId: 'lesson1',
      exerciseType: 'multipleChoice',
      question: 'Câu hỏi mẫu?',
      order: 1,
    });

    // Lưu bài tập
    const savedExercise = await newExercise.save();
    console.log('Bài tập đã được lưu:', savedExercise);

    // 2. Tạo và lưu các đáp án cho bài tập
    const options = [
      { exerciseId: savedExercise._id, correct: true, text: 'Đáp án A' },
      { exerciseId: savedExercise._id, correct: false, text: 'Đáp án B' },
      { exerciseId: savedExercise._id, correct: false, text: 'Đáp án C' },
    ];

    // Lưu tất cả các đáp án
    const savedOptions = await ExerciseOption.insertMany(options);
    console.log('Các đáp án đã được lưu:', savedOptions);
    
  } catch (error) {
    console.error('Lỗi khi thêm bài tập hoặc đáp án:', error);
  } finally {
    // Đóng kết nối
    mongoose.connection.close();
  }
}

// Gọi hàm để thực hiện
addExerciseWithOptions();


// fakeData
// [
//     {
//       "title": "Câu hỏi 1: Thủ đô của Việt Nam là gì?",
//       "options": [
//         { "text": "Hà Nội", "isCorrect": true },
//         { "text": "Thành phố Hồ Chí Minh", "isCorrect": false },
//         { "text": "Đà Nẵng", "isCorrect": false },
//         { "text": "Hải Phòng", "isCorrect": false }
//       ]
//     },
//     {
//       "title": "Câu hỏi 2: Ai là tác giả của tác phẩm 'Truyện Kiều'?",
//       "options": [
//         { "text": "Nam Cao", "isCorrect": false },
//         { "text": "Nguyễn Du", "isCorrect": true },
//         { "text": "Tố Hữu", "isCorrect": false },
//         { "text": "Xuân Diệu", "isCorrect": false }
//       ]
//     },
//     {
//       "title": "Câu hỏi 3: Địa điểm nào là kỳ quan thiên nhiên thế giới?",
//       "options": [
//         { "text": "Vịnh Hạ Long", "isCorrect": true },
//         { "text": "Cố đô Huế", "isCorrect": false },
//         { "text": "Phố cổ Hội An", "isCorrect": false },
//         { "text": "Thành phố Đà Nẵng", "isCorrect": false }
//       ]
//     },
//     {
//       "title": "Câu hỏi 4: Ai là người sáng lập ra Facebook?",
//       "options": [
//         { "text": "Bill Gates", "isCorrect": false },
//         { "text": "Steve Jobs", "isCorrect": false },
//         { "text": "Mark Zuckerberg", "isCorrect": true },
//         { "text": "Larry Page", "isCorrect": false }
//       ]
//     },
//     {
//       "title": "Câu hỏi 5: Nước nào có diện tích lớn nhất thế giới?",
//       "options": [
//         { "text": "Trung Quốc", "isCorrect": false },
//         { "text": "Hoa Kỳ", "isCorrect": false },
//         { "text": "Canada", "isCorrect": true },
//         { "text": "Nga", "isCorrect": false }
//       ]
//     }
//   ]
  