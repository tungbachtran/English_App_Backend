const express = require('express');
const router = express.Router();
const controller = require ('../../controllers/progress/progress.controller');
router.post('/', controller.createProgress);


module.exports = router;