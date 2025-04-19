const express = require('express');
const router = express.Router();
const unitController = require('../../controllers/unit/unit.controller');

router.get('/language/:languageId', unitController.getUnitsByLanguage);

module.exports = router;
