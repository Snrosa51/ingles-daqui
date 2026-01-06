const auth = require('../middlewares/auth');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/connection');

const router = express.Router();

/**
 * POST /admin/api/login
 */
const loginRateLimit = require('../middlewares/loginRateLimit');

router.post('/login', loginRateLimit, async (req, res) => {

  try {
    const { username, password } = req.body;

    // 1. Validação de entrada
    if (!username || !password) {
      return res.status(400).json({
        message: 'Usuário e senha são obrigatórios'
      });
    }

    // rota protegida
router.get('/lessons', auth, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, title, level, description FROM lessons ORDER BY id DESC'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao buscar aulas' });
  }
});

    // 2. Busca admin
    const [rows] = await db.query(
      'SELECT id, username, password_hash FROM admins WHERE username = ? LIMIT 1',
      [username]
    );

    if (rows.length === 0) {
      // mensagem genérica (segurança)
      return res.status(401).json({
        message: 'Usuário ou senha inválidos'
      });
    }

    const admin = rows[0];

    // 3. Valida senha
    const senhaValida = await bcrypt.compare(password, admin.password_hash);

    if (!senhaValida) {
      return res.status(401).json({
        message: 'Usuário ou senha inválidos'
      });
    }

    // 4. Gera JWT (mínimo necessário)
    const token = jwt.sign(
      {
        id: admin.id,
        username: admin.username
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '12h'
      }
    );

    // 5. Resposta
    res.json({
      message: 'Login realizado com sucesso',
      token
    });

  } catch (err) {
    console.error('Erro no login admin:', err);

    res.status(500).json({
      message: 'Erro interno do servidor'
    });
  }
});

module.exports = router;

