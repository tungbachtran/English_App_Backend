const mongoose = require('mongoose');
const UserExerciseResult = require('../../models/user/user_exercise_result.model');
const UserLessonProgress = require('../../models/user/user_lesson_progress.model');
const UserMistake = require('../../models/user/user_mistake.model');
const Exercise = require('../../models/exercise/exercise.model');
const ExerciseOption = require('../../models/exercise/exercise_option.model');
const Lesson = require('../../models/lesson/lesson.model');
const Unit = require('../../models/unit/unit.model');
const User = require('../../models/user/user.model');

// API lưu kết quả một bài tập
module.exports.submitExerciseResult = async (req, res) => {
  try {
    const { userId, exerciseId, selectedOptionId, timeTaken } = req.body;
    
    // Kiểm tra dữ liệu đầu vào
    if (!userId || !exerciseId || !selectedOptionId) {
      return res.status(400).json({ message: 'Thiếu thông tin cần thiết' });
    }

    // Kiểm tra exerciseId có tồn tại không
    const exercise = await Exercise.findById(exerciseId);
    if (!exercise) {
      return res.status(404).json({ message: 'Không tìm thấy bài tập' });
    }

    // Kiểm tra selectedOptionId có tồn tại không
    const selectedOption = await ExerciseOption.findById(selectedOptionId);
    if (!selectedOption) {
      return res.status(404).json({ message: 'Không tìm thấy đáp án đã chọn' });
    }

    // Kiểm tra đáp án đúng hay sai
    const isCorrect = selectedOption.correct === true;

    // Lấy đáp án đúng
    const correctOption = await ExerciseOption.findOne({ 
      exerciseId: exerciseId, 
      correct: true 
    });

    // Lưu kết quả bài tập
    const userExerciseResult = new UserExerciseResult({
      userId,
      exerciseId,
      selectedOptionId,
      isCorrect,
      lessonId: exercise.lessonId,
      timeTaken: timeTaken || 0
    });

    await userExerciseResult.save();

    // Nếu sai, lưu vào bảng mistakes để xem lại
    if (!isCorrect) {
      // Lấy thông tin unit và language
      const lesson = await Lesson.findById(exercise.lessonId);
      if (lesson) {
        const unit = await Unit.findById(lesson.unitId);
        if (unit) {
          const userMistake = new UserMistake({
            userId,
            exerciseId,
            selectedOptionId,
            correctOptionId: correctOption._id,
            lessonId: exercise.lessonId,
            unitId: lesson.unitId,
            languageId: unit.languageId
          });
          await userMistake.save();
        }
      }
    }

    res.status(200).json({
      isCorrect,
      correctOptionId: correctOption._id,
      message: isCorrect ? 'Chính xác!' : 'Không chính xác!'
    });
  } catch (error) {
    console.error('Lỗi khi nộp kết quả bài tập:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi lưu kết quả' });
  }
};

// API lưu kết quả sau khi hoàn thành bài học
module.exports.saveLessonResults = async (req, res) => {
  try {
    const { userId, lessonId, results, timeSpent } = req.body;
    
    // Kiểm tra dữ liệu đầu vào
    if (!userId || !lessonId || !results || !Array.isArray(results)) {
      return res.status(400).json({ message: 'Thiếu thông tin cần thiết' });
    }

    // Lấy thông tin bài học
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: 'Không tìm thấy bài học' });
    }

    // Lấy thông tin unit và language
    const unit = await Unit.findById(lesson.unitId);
    if (!unit) {
      return res.status(404).json({ message: 'Không tìm thấy unit' });
    }

    // Tính toán số câu đúng
    const totalExercises = results.length;
    const correctAnswers = results.filter(result => result.isCorrect).length;
    const score = Math.round((correctAnswers / totalExercises) * 100);
    
    // Tính số tim đã sử dụng
    const heartsUsed = totalExercises - correctAnswers;
    
    // Tính kinh nghiệm nhận được
    const experienceGained = Math.round((correctAnswers / totalExercises) * lesson.experienceReward);

    // Cập nhật tim và kinh nghiệm cho user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
    
    // Trừ tim
    user.hearts = Math.max(0, user.hearts - heartsUsed);
    
    // Cộng kinh nghiệm
    user.experience += experienceGained;
    
    // Cập nhật kinh nghiệm cho ngôn ngữ cụ thể
    const languageIndex = user.languages.findIndex(
      lang => lang.languageId.toString() === unit.languageId.toString()
    );
    
    if (languageIndex !== -1) {
      user.languages[languageIndex].experience += experienceGained;
    } else {
      user.languages.push({
        languageId: unit.languageId,
        level: 0,
        experience: experienceGained
      });
    }
    
    // Cập nhật streak nếu là ngày mới
    const today = new Date().setHours(0, 0, 0, 0);
    const lastActiveDay = new Date(user.lastActive).setHours(0, 0, 0, 0);
    
    if (today > lastActiveDay) {
      user.streak += 1;
    }
    
    user.lastActive = new Date();
    
    await user.save();

    // Lưu tiến độ bài học
    const existingProgress = await UserLessonProgress.findOne({ userId, lessonId });
    
    if (existingProgress) {
      existingProgress.completed = true;
      existingProgress.score = Math.max(existingProgress.score, score);
      existingProgress.totalExercises = totalExercises;
      existingProgress.correctAnswers = correctAnswers;
      existingProgress.heartsUsed += heartsUsed;
      existingProgress.experienceGained += experienceGained;
      existingProgress.timeSpent += timeSpent || 0;
      existingProgress.completedAt = new Date();
      existingProgress.attempts += 1;
      
      await existingProgress.save();
    } else {
      const newProgress = new UserLessonProgress({
        userId,
        lessonId,
        completed: true,
        score,
        totalExercises,
        correctAnswers,
        heartsUsed,
        experienceGained,
        timeSpent: timeSpent || 0,
        completedAt: new Date(),
        attempts: 1
      });
      
      await newProgress.save();
    }

    // Lưu kết quả từng bài tập
    const savePromises = results.map(result => {
      const userExerciseResult = new UserExerciseResult({
        userId,
        exerciseId: result.exerciseId,
        selectedOptionId: result.selectedOptionId,
        isCorrect: result.isCorrect,
        lessonId,
        timeTaken: result.timeTaken || 0
      });
      return userExerciseResult.save();
    });

    await Promise.all(savePromises);

    // Lưu các câu sai vào bảng mistakes
    const incorrectResults = results.filter(result => !result.isCorrect);
    
    if (incorrectResults.length > 0) {
      for (const result of incorrectResults) {
        // Lấy đáp án đúng
        const correctOption = await ExerciseOption.findOne({
          exerciseId: result.exerciseId,
          correct: true
        });
        
        if (correctOption) {
          const userMistake = new UserMistake({
            userId,
            exerciseId: result.exerciseId,
            selectedOptionId: result.selectedOptionId,
            correctOptionId: correctOption._id,
            lessonId,
            unitId: lesson.unitId,
            languageId: unit.languageId
          });
          
          await userMistake.save();
        }
      }
    }

    // Kiểm tra xem có bài học tiếp theo không
    const nextLesson = await Lesson.findOne({
      unitId: lesson.unitId,
      order: { $gt: lesson.order },
      isActive: true
    }).sort({ order: 1 });

    res.status(200).json({
      totalExercises,
      correctAnswers,
      score,
      heartsUsed,
      experienceGained,
      heartsRemaining: user.hearts,
      completed: true,
      nextLessonId: nextLesson ? nextLesson._id : null,
      message: 'Đã lưu kết quả bài học thành công'
    });
  } catch (error) {
    console.error('Lỗi khi lưu kết quả bài học:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi lưu kết quả' });
  }
};

// API lấy danh sách câu sai của người dùng
// API lấy danh sách câu sai của người dùng (tiếp)
module.exports.getUserMistakes = async (req, res) => {
    try {
      const { userId } = req.params;
      const { languageId, unitId, lessonId, limit } = req.query;
      
      const query = { userId };
      
      if (languageId) query.languageId = languageId;
      if (unitId) query.unitId = unitId;
      if (lessonId) query.lessonId = lessonId;
      
      // Lấy danh sách lỗi, sắp xếp theo thời gian tạo gần nhất
      let mistakesQuery = UserMistake.find(query)
        .sort({ createdAt: -1 });
      
      if (limit) {
        mistakesQuery = mistakesQuery.limit(parseInt(limit));
      }
      
      const mistakes = await mistakesQuery.exec();
      
      // Lấy thông tin chi tiết cho mỗi lỗi
      const response = await Promise.all(mistakes.map(async (mistake) => {
        const mistakeObj = mistake.toObject();
        mistakeObj.id = mistakeObj._id.toString();
        delete mistakeObj._id;
        
        // Lấy thông tin exercise
        const exercise = await Exercise.findById(mistake.exerciseId);
        
        // Lấy thông tin đáp án đã chọn
        const selectedOption = await ExerciseOption.findById(mistake.selectedOptionId);
        
        // Lấy thông tin đáp án đúng
        const correctOption = await ExerciseOption.findById(mistake.correctOptionId);
        
        // Lấy tất cả các đáp án của bài tập
        const allOptions = await ExerciseOption.find({ exerciseId: mistake.exerciseId });
        
        return {
          ...mistakeObj,
          exercise: exercise ? {
            id: exercise._id.toString(),
            question: exercise.question,
            instruction: exercise.instruction,
            exerciseType: exercise.exerciseType,
            audioUrl: exercise.audioUrl,
            imageUrl: exercise.imageUrl
          } : null,
          selectedOption: selectedOption ? {
            id: selectedOption._id.toString(),
            text: selectedOption.text,
            audioUrl: selectedOption.audioUrl,
            imageUrl: selectedOption.imageUrl
          } : null,
          correctOption: correctOption ? {
            id: correctOption._id.toString(),
            text: correctOption.text,
            audioUrl: correctOption.audioUrl,
            imageUrl: correctOption.imageUrl
          } : null,
          allOptions: allOptions.map(option => ({
            id: option._id.toString(),
            text: option.text,
            isCorrect: option.correct,
            audioUrl: option.audioUrl,
            imageUrl: option.imageUrl
          }))
        };
      }));
      
      res.status(200).json(response);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách câu sai:', error);
      res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy dữ liệu' });
    }
  };
  
  // API đánh dấu đã xem lại câu sai
  module.exports.reviewMistake = async (req, res) => {
    try {
      const { mistakeId } = req.params;
      
      const mistake = await UserMistake.findById(mistakeId);
      if (!mistake) {
        return res.status(404).json({ message: 'Không tìm thấy câu sai' });
      }
      
      mistake.reviewedCount += 1;
      mistake.lastReviewed = new Date();
      
      // Nếu đã xem lại >= 3 lần, đánh dấu là đã thành thạo
      if (mistake.reviewedCount >= 3) {
        mistake.mastered = true;
      }
      
      await mistake.save();
      
      res.status(200).json({
        id: mistake._id.toString(),
        reviewedCount: mistake.reviewedCount,
        lastReviewed: mistake.lastReviewed,
        mastered: mistake.mastered,
        message: 'Đã cập nhật thông tin xem lại'
      });
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin xem lại:', error);
      res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật dữ liệu' });
    }
  };
  
  // API xem chi tiết một câu sai
  module.exports.getMistakeDetail = async (req, res) => {
    try {
      const { mistakeId } = req.params;
      
      const mistake = await UserMistake.findById(mistakeId);
      if (!mistake) {
        return res.status(404).json({ message: 'Không tìm thấy câu sai' });
      }
      
      // Lấy thông tin exercise
      const exercise = await Exercise.findById(mistake.exerciseId);
      
      // Lấy thông tin đáp án đã chọn
      const selectedOption = await ExerciseOption.findById(mistake.selectedOptionId);
      
      // Lấy thông tin đáp án đúng
      const correctOption = await ExerciseOption.findById(mistake.correctOptionId);
      
      // Lấy tất cả các đáp án của bài tập
      const allOptions = await ExerciseOption.find({ exerciseId: mistake.exerciseId });
      
      const mistakeObj = mistake.toObject();
      mistakeObj.id = mistakeObj._id.toString();
      delete mistakeObj._id;
      
      res.status(200).json({
        ...mistakeObj,
        exercise: exercise ? {
          id: exercise._id.toString(),
          question: exercise.question,
          instruction: exercise.instruction,
          exerciseType: exercise.exerciseType,
          audioUrl: exercise.audioUrl,
          imageUrl: exercise.imageUrl
        } : null,
        selectedOption: selectedOption ? {
          id: selectedOption._id.toString(),
          text: selectedOption.text,
          audioUrl: selectedOption.audioUrl,
          imageUrl: selectedOption.imageUrl
        } : null,
        correctOption: correctOption ? {
          id: correctOption._id.toString(),
          text: correctOption.text,
          audioUrl: correctOption.audioUrl,
          imageUrl: correctOption.imageUrl
        } : null,
        allOptions: allOptions.map(option => ({
          id: option._id.toString(),
          text: option.text,
          isCorrect: option.correct,
          audioUrl: option.audioUrl,
          imageUrl: option.imageUrl
        }))
      });
    } catch (error) {
      console.error('Lỗi khi lấy chi tiết câu sai:', error);
      res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy dữ liệu' });
    }
  };
  
