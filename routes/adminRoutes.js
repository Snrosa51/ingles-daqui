/**
 * ======================================
 * Rotas Administrativas
 * Prefixo aplicado no index.js:
 * app.use('/admin/api', adminRoutes);
 *
 * Portanto, NÃO repetir /admin/api aqui.
 * ======================================
 */

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db/connection');
// const auth = require('../middlewares/auth'); // usado depois

const router = express.Router();

/**
 * ======================================
 * LOGIN ADMIN
 * Rota final:
 * POST /admin/api/login
 * ======================================
 */
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // 🔎 Validação básica
  if (!username || !password) {
    return res.status(400).json({
      message: 'Usuário e senha são obrigatórios'
    });
  }

  try {
    // 🔎 Busca admin no banco
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

    // 🔐 Comparação da senha com bcrypt
    const senhaValida = await bcrypt.compare(password, admin.password_hash);

    if (!senhaValida) {
      return res.status(401).json({
        message: 'Usuário ou senha inválidos'
      });
    }

    // 🎟️ Geração do token JWT
    const token = jwt.sign(
      {
        id: admin.id,
        username: admin.username
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '4h'
      }
    );

    // ✅ Login OK
    return res.json({
      message: 'Login realizado com sucesso',
      token
    });

  } catch (error) {
    console.error('❌ Erro interno no login admin:', error);

    return res.status(500).json({
      message: 'Erro interno do servidor'
    });
  }
});


/* * ======================================
 * EXEMPLO DE ROTA PROTEGIDA (FUTURO)
 * GET /admin/api/lessons
 * ======================================
 */
 
  router.get('/lessons', auth, async (req, res) => {
    const [rows] = await db.query('SELECT * FROM lessons');
    res.json(rows);
  });
 

/**
 * ======================================
 * EXPORTAÇÃO DO ROUTER
 * ======================================
 */
module.exports = router;
