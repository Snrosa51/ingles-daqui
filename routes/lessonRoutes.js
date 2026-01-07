const express = require('express');
const router = express.Router();
const db = require('../db/connection');
const Lesson = require('../models/lessonModel');

// todas as lições
router.get('/', async (req, res) => {
  const [rows] = await db.query(
    'SELECT id, title, level, description FROM lessons ORDER BY id DESC'
  );
  res.json(rows);
});

// 🔹 UMA lição
router.get('/:id', async (req, res) => {
  const [rows] = await db.query(
    'SELECT * FROM lessons WHERE id = ? LIMIT 1',
    [req.params.id]
  );

  if (!rows.length) {
    return res.status(404).json({ message: 'Lição não encontrada' });
  }

  res.json(rows[0]);
});

module.exports = router;

