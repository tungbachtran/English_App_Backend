const express = require('express');
const router = express.Router();
const userController = require('../../controllers/user/user.controller');

router.get('/:userId', userController.getUserInfo);
router.patch('/:userId/hearts', userController.updateHearts);
router.get('/:userId/language/:languageId/stats', userController.getLanguageStats);

module.exports = router;
