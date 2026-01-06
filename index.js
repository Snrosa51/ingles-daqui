require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

/* =========================
   Middlewares básicos
========================= */
app.use(express.json());

/* =========================
   Arquivos estáticos
========================= */
// public → JS, CSS, imagens
app.use(express.static(path.join(__dirname, 'public')));

// views → páginas HTML públicas
app.use(express.static(path.join(__dirname, 'views')));

/* =========================
   Rotas da API
========================= */
app.use('/admin/api', require('./routes/adminRoutes'));
app.use('/api/lessons', require('./routes/lessonRoutes'));

/* =========================
   Fallback 404
========================= */
app.use((req, res) => {
  res.status(404).send('Página não encontrada');
});

/* ========================= */
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Inglês Daqui rodando na porta ${PORT}`);
});
