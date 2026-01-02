/**
 * ======================================
 * Rotas Administrativas
 * Prefixo aplicado no index.js:
 * app.use('/admin/api', adminRoutes);
 * ======================================
 */

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/connection');
const auth = require('../middlewares/auth'); // ✅ IMPORTANTE

const router = express.Router();

/**
 * ======================================
 * LOGIN ADMIN
 * POST /admin/api/login
 * ======================================
 */
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: 'Usuário e senha são obrigatórios'
    });
  }

  try {
    const [rows] = await db.query(
      'SELECT id, username, password_hash FROM admins WHERE username = ? LIMIT 1',
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        message: 'Usuário ou senha inválidos'
      });
    }

    const admin = rows[0];
    const senhaOk = await bcrypt.compare(password, admin.password_hash);

    if (!senhaOk) {
      return res.status(401).json({
        message: 'Usuário ou senha inválidos'
      });
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: '4h' }
    );

    return res.json({
      message: 'Login realizado com sucesso',
      token
    });

  } catch (error) {
    console.error('Erro no login admin:', error);
    return res.status(500).json({
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * ======================================
 * LISTAR AULAS (PROTEGIDO)
 * GET /admin/api/lessons
 * ======================================
 */
router.get('/lessons', auth, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, title, level FROM lessons ORDER BY id DESC'
    );
    res.json(rows);
  } catch (error) {
    console.error('Erro ao listar aulas:', error);
    res.status(500).json({
      message: 'Erro interno do servidor'
    });
  }
});

module.exports = router;
