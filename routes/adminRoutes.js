const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator');
const Lesson = require('../models/lessonModel');
const { validateLesson } = require('../middlewares/validateLesson');

router.post('/lesson', validateLesson, async (req, res) => {
  if (req.headers.authorization !== process.env.ADMIN_TOKEN) {
    return res.status(403).json({ error: 'Acesso negado' });
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array());
  }

  const id = await Lesson.create(req.body);
  res.json({ success: true, id });
});

module.exports = router;
