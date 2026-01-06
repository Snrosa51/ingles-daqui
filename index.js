require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

/* =========================
   MIDDLEWARES BÁSICOS
========================= */
app.use(express.json());

/* =========================
   ARQUIVOS ESTÁTICOS
   (CSS, JS, imagens)
========================= */
app.use(express.static(path.join(__dirname, 'public')));

/* =========================
   PÁGINAS PÚBLICAS (HTML)
========================= */

// Página inicial
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Sobre
app.get('/sobre', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'sobre.html'));
});

// Contato
app.get('/contato', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'contato.html'));
});

// Links úteis
app.get('/links-uteis', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'links-uteis.html'));
});

/* =========================
   ROTAS DA API
========================= */
app.use('/admin/api', require('./routes/adminRoutes'));
app.use('/api/lessons', require('./routes/lessonRoutes'));

/* =========================
   FALLBACK 404
========================= */
app.use((req, res) => {
  res.status(404).send('Página não encontrada');
});

/* =========================
   START SERVER
========================= */
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Inglês The Key rodando na porta ${PORT}`);
});
