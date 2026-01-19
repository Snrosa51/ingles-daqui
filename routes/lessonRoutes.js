// routes/lessonRoutes.js
const express = require("express");
const router = express.Router();
const db = require("../db/connection");

// GET /api/lessons  -> lista todas
router.get("/", async (req, res) => {
  try {
    const lessons = await db.query(
      "SELECT id, title, level, description FROM lessons ORDER BY id ASC"
    );
    return res.json(lessons); // <-- ARRAY
  } catch (err) {
    console.error("❌ Erro ao buscar lessons:", err.message);
    return res.status(500).json({ error: "Erro ao buscar lessons" });
  }
});

// GET /api/lessons/:id -> uma lição
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const rows = await db.query(
      "SELECT id, title, level, description, content, created_at FROM lessons WHERE id = ? LIMIT 1",
      [id]
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: "Lição não encontrada" });
    }

    return res.json(rows[0]); // <-- OBJETO
  } catch (err) {
    console.error("❌ Erro ao buscar lesson:", err.message);
    return res.status(500).json({ error: "Erro ao buscar lesson" });
  }
});

module.exports = router;

