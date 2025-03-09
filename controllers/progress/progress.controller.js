const Progress = require('../../models/progress/progress.model');


// Hàm để xử lý yêu cầu POST /api/progress
module.exports.createProgress = async (req, res) => {
    const { userId, lessonId, unitId, status } = req.body;

    // Kiểm tra xem tất cả các trường có được cung cấp không
    if (!userId || !lessonId || !unitId || !status) {
        return res.status(400).json({ message: 'Tất cả các trường là bắt buộc.' });
    }

    try {
        // Tạo một đối tượng tiến trình mới
        const newProgress = new Progress({
            userId,
            lessonId,
            unitId,
            status
        });

        // Lưu tiến trình vào cơ sở dữ liệu
        await newProgress.save();

        // Trả về phản hồi thành công
        return res.status(201).json({ message: 'Tiến trình đã được tạo thành công.', progress: newProgress });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Đã xảy ra lỗi khi tạo tiến trình.', error });
    }
};
