const Language = require('../../models/language/language.model');

// Lấy danh sách ngôn ngữ
module.exports.getLanguages = async (req, res) => {
  try {
    const languages = await Language.find({ isActive: true });
    
    const response = languages.map(language => {
      const languageObj = language.toObject();
      languageObj.id = languageObj._id.toString();
      delete languageObj._id;
      
      return languageObj;
    });
    
    res.status(200).json(response);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách ngôn ngữ:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy dữ liệu' });
  }
};

// Lấy chi tiết ngôn ngữ
module.exports.getLanguageById = async (req, res) => {
  try {
    const { id } = req.params;
    const language = await Language.findById(id);
    
    if (!language) {
      return res.status(404).json({ message: 'Không tìm thấy ngôn ngữ' });
    }
    
    const languageObj = language.toObject();
    languageObj.id = languageObj._id.toString();
    delete languageObj._id;
    
    res.status(200).json(languageObj);
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết ngôn ngữ:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy dữ liệu' });
  }
};
