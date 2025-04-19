const express = require('express');
const router = express.Router();
const languageController = require('../../controllers/language/language.controller');

router.get('/', languageController.getLanguages);
router.get('/:id', languageController.getLanguageById);

module.exports = router;
