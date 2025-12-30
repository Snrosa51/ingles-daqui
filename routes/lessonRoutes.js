const express = require('express');
const router = express.Router();
const Lesson = require('../models/lessonModel');

router.get('/', async (req, res) => {
  const lessons = await Lesson.getAll();
  res.json(lessons);
});

module.exports = router;
