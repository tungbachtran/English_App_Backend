const express = require('express');
const router = express.Router();
const lessonController = require('../../controllers/lesson/lesson.controller');

router.get('/unit/:unitId', lessonController.getLessonsByUnit);
router.get('/:id', lessonController.getLessonById);

module.exports = router;
